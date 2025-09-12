import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchSuggestion {
  _id: string;
  name: string;
  type: 'product' | 'category' | 'brand';
  image?: string;
  price?: number;
  category?: string;
}

interface SearchHistory {
  query: string;
  timestamp: number;
  results: number;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters?: any) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

export default function AdvancedSearch({ 
  onSearch, 
  placeholder = "Search for auto parts, accessories...",
  showFilters = true,
  className = ""
}: AdvancedSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Advanced filters state
  const [filters, setFilters] = useState({
    priceRange: { min: '', max: '' },
    categories: [] as string[],
    brands: [] as string[],
    inStock: false,
    featured: false,
    rating: 0
  });

  useEffect(() => {
    loadSearchHistory();
    loadTrendingSearches();
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const loadSearchHistory = () => {
    const stored = localStorage.getItem('searchHistory');
    if (stored) {
      try {
        const history = JSON.parse(stored);
        setSearchHistory(history.slice(0, 5)); // Keep only last 5
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  };

  const saveSearchHistory = (searchQuery: string, resultCount: number) => {
    const newHistory = {
      query: searchQuery,
      timestamp: Date.now(),
      results: resultCount
    };
    
    const existing = searchHistory.filter(h => h.query !== searchQuery);
    const updated = [newHistory, ...existing].slice(0, 10);
    
    localStorage.setItem('searchHistory', JSON.stringify(updated));
    setSearchHistory(updated.slice(0, 5));
  };

  const loadTrendingSearches = async () => {
    try {
      const response = await api.get('/search/trending');
      setTrendingSearches(response.data.trending || []);
    } catch (error) {
      console.error('Error loading trending searches:', error);
      // Fallback trending searches
      setTrendingSearches([
        'brake pads',
        'engine oil',
        'headlights',
        'battery',
        'tires',
        'air filter'
      ]);
    }
  };

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await api.get('/search/suggestions', {
        params: { q: searchQuery, limit: 8 }
      });
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchQuery?: string, customFilters?: any) => {
    const finalQuery = searchQuery || query;
    const finalFilters = customFilters || filters;
    
    if (!finalQuery.trim()) return;

    // Save to history (mock result count for now)
    saveSearchHistory(finalQuery, 0);
    
    // Perform search
    onSearch(finalQuery, finalFilters);
    
    // Navigate to search results
    const searchParams = new URLSearchParams({
      q: finalQuery,
      ...Object.entries(finalFilters).reduce((acc, [key, value]) => {
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          acc[key] = Array.isArray(value) ? value.join(',') : value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    });
    
    navigate(`/search?${searchParams.toString()}`);
    setIsOpen(false);
    setQuery(finalQuery);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/product/${suggestion._id}`);
    } else {
      handleSearch(suggestion.name);
    }
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: '', max: '' },
      categories: [],
      brands: [],
      inStock: false,
      featured: false,
      rating: 0
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.categories.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.inStock) count++;
    if (filters.featured) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  const renderSuggestions = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 text-sm text-gray-600">Searching...</span>
        </div>
      );
    }

    if (query.length >= 2 && suggestions.length === 0 && !loading) {
      return (
        <div className="py-4 px-3 text-center text-sm text-gray-600">
          No suggestions found for "{query}"
        </div>
      );
    }

    if (suggestions.length > 0) {
      return (
        <CommandGroup heading="Suggestions">
          {suggestions.map((suggestion) => (
            <CommandItem
              key={`${suggestion.type}-${suggestion._id}`}
              onSelect={() => handleSuggestionClick(suggestion)}
              className="flex items-center gap-3 py-2"
            >
              {suggestion.image && (
                <img
                  src={suggestion.image}
                  alt={suggestion.name}
                  className="w-8 h-8 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <div className="font-medium">{suggestion.name}</div>
                {suggestion.category && (
                  <div className="text-xs text-gray-500">in {suggestion.category}</div>
                )}
              </div>
              {suggestion.price && (
                <div className="text-sm font-medium">₹{suggestion.price}</div>
              )}
              <Badge variant="secondary" className="text-xs">
                {suggestion.type}
              </Badge>
            </CommandItem>
          ))}
        </CommandGroup>
      );
    }

    return null;
  };

  const renderTrending = () => {
    if (query.length === 0 && trendingSearches.length > 0) {
      return (
        <CommandGroup heading="Trending Searches">
          {trendingSearches.map((trend, index) => (
            <CommandItem
              key={index}
              onSelect={() => handleSearch(trend)}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-3 w-3 text-gray-400" />
              <span>{trend}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      );
    }
    return null;
  };

  const renderHistory = () => {
    if (query.length === 0 && searchHistory.length > 0) {
      return (
        <CommandGroup heading="Recent Searches">
          {searchHistory.map((item, index) => (
            <CommandItem
              key={index}
              onSelect={() => handleSearch(item.query)}
              className="flex items-center justify-between"
            >
              <span>{item.query}</span>
              <span className="text-xs text-gray-400">
                {item.results} results
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      );
    }
    return null;
  };

  return (
    <div className={`relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              placeholder={placeholder}
              className="pl-10 pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {showFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className="h-6 px-2"
                >
                  <Filter className="h-3 w-3" />
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleSearch()}
                className="h-6 px-2"
              >
                <Search className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent 
          className="w-full p-0" 
          align="start"
          style={{ width: inputRef.current?.offsetWidth }}
        >
          <Command>
            <CommandInput 
              value={query}
              onValueChange={setQuery}
              placeholder="Type to search..."
              className="hidden"
            />
            <CommandList className="max-h-80">
              <CommandEmpty>
                {query.length >= 2 ? 'No results found.' : 'Start typing to search...'}
              </CommandEmpty>
              
              {renderSuggestions()}
              {renderTrending()}
              {renderHistory()}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Advanced Filters Panel */}
      {showFiltersPanel && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Advanced Filters</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  disabled={getActiveFiltersCount() === 0}
                >
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFiltersPanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, min: e.target.value }
                    }))}
                    className="text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: e.target.value }
                    }))}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quick Filters</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        inStock: e.target.checked
                      }))}
                    />
                    <span className="text-sm">In Stock Only</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        featured: e.target.checked
                      }))}
                    />
                    <span className="text-sm">Featured Products</span>
                  </label>
                </div>
              </div>

              {/* Apply Button */}
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    handleSearch(query, filters);
                    setShowFiltersPanel(false);
                  }}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
