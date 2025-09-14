import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ThumbsUp, Flag, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: string[];
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsData {
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  ratingSummary: Array<{ _id: number; count: number }>;
  averageRating: {
    averageRating: number;
    totalReviews: number;
  };
}

interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
}

export default function ProductReviews() {
  const { productId } = useParams<{ productId: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, currentPage, sortBy, order]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/product/${productId}`, {
        params: { page: currentPage, sortBy, order }
      });
      setReviewsData(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to write a review',
        variant: 'destructive'
      });
      return;
    }

    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);
      const reviewData = {
        productId,
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim()
      };

      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, reviewData);
        toast({
          title: 'Success',
          description: 'Review updated successfully'
        });
      } else {
        await api.post('/reviews', reviewData);
        toast({
          title: 'Success',
          description: 'Review submitted successfully'
        });
      }

      setShowReviewForm(false);
      setEditingReview(null);
      setReviewForm({ rating: 5, title: '', comment: '' });
      fetchReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit review',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast({
        title: 'Success',
        description: 'Review deleted successfully'
      });
      fetchReviews();
    } catch (error: any) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete review',
        variant: 'destructive'
      });
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to mark reviews as helpful',
        variant: 'destructive'
      });
      return;
    }

    try {
      await api.post(`/reviews/${reviewId}/helpful`);
      fetchReviews();
    } catch (error: any) {
      console.error('Error marking review as helpful:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update review',
        variant: 'destructive'
      });
    }
  };

  const handleReportReview = async (reviewId: string, reason: string) => {
    try {
      await api.post(`/reviews/${reviewId}/report`, { reason });
      toast({
        title: 'Success',
        description: 'Review reported successfully'
      });
    } catch (error: any) {
      console.error('Error reporting review:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to report review',
        variant: 'destructive'
      });
    }
  };

  const startEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment
    });
    setShowReviewForm(true);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const starSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingSummary = () => {
    if (!reviewsData) return null;

    const { ratingSummary, averageRating } = reviewsData;
    const totalReviews = averageRating.totalReviews;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{averageRating.averageRating.toFixed(1)}</div>
              {renderStars(Math.round(averageRating.averageRating), 'lg')}
              <div className="text-sm text-gray-600 mt-1">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingSummary.find(r => r._id === rating)?.count || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-8">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="mt-4">
              <Button onClick={() => setShowReviewForm(true)}>
                Write a Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!reviewsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to load reviews</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderRatingSummary()}

      {/* Sort Controls */}
      <div className="flex gap-4 items-center">
        <Label>Sort by:</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="helpful">Helpfulness</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={order} onValueChange={setOrder}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsData.reviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          reviewsData.reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.user.name}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    
                    {user && user._id === review.user._id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => startEditReview(review)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkHelpful(review._id)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    Helpful ({review.helpfulCount})
                  </Button>
                  
                  {user && user._id !== review.user._id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Flag className="h-3 w-3 mr-1" />
                          Report
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleReportReview(review._id, 'inappropriate')}>
                          Inappropriate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReportReview(review._id, 'spam')}>
                          Spam
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReportReview(review._id, 'fake')}>
                          Fake Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReportReview(review._id, 'offensive')}>
                          Offensive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {reviewsData.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={!reviewsData.pagination.hasPrev}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          
          <span className="flex items-center px-4">
            Page {reviewsData.pagination.currentPage} of {reviewsData.pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            disabled={!reviewsData.pagination.hasNext}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Review Form Dialog */}
      <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingReview ? 'Edit Review' : 'Write a Review'}
            </DialogTitle>
            <DialogDescription>
              Share your experience with this product
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= reviewForm.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="title">Review Title</Label>
              <Input
                id="title"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                placeholder="Summarize your review"
                maxLength={100}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="comment">Review</Label>
              <Textarea
                id="comment"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Tell others about your experience with this product"
                rows={4}
                maxLength={1000}
                required
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                  setReviewForm({ rating: 5, title: '', comment: '' });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
