import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

interface ErrorDisplayProps {
  error?: Error;
  title?: string;
  description?: string;
  showRetry?: boolean;
  showHome?: boolean;
  showBack?: boolean;
  onRetry?: () => void;
  className?: string;
}

// Generic Error Display Component
export function ErrorDisplay({
  error,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  showRetry = true,
  showHome = true,
  showBack = false,
  onRetry,
  className = ''
}: ErrorDisplayProps) {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={`min-h-[400px] flex items-center justify-center p-4 ${className}`}>
      <Helmet>
        <title>Error - Panditji Auto Connect</title>
      </Helmet>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
          <CardDescription className="text-gray-600">{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && process.env.NODE_ENV === 'development' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm font-mono">
                {error.message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col gap-2">
            {showRetry && (
              <Button onClick={handleRetry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            
            {showBack && (
              <Button variant="outline" onClick={handleGoBack} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            )}
            
            {showHome && (
              <Button variant="outline" onClick={handleGoHome} className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Network Error Component
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      title="Connection Problem"
      description="Unable to connect to our servers. Please check your internet connection and try again."
      onRetry={onRetry}
      showHome={true}
      showRetry={true}
    />
  );
}

// Not Found Error Component
export function NotFoundError({ 
  resource = 'page',
  onRetry
}: { 
  resource?: string;
  onRetry?: () => void;
}) {
  return (
    <ErrorDisplay
      title={`${resource.charAt(0).toUpperCase() + resource.slice(1)} Not Found`}
      description={`The ${resource} you're looking for doesn't exist or has been moved.`}
      showRetry={false}
      showHome={true}
      showBack={true}
      onRetry={onRetry}
    />
  );
}

// Server Error Component
export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      title="Server Error"
      description="Our servers are experiencing issues. Please try again in a few moments."
      onRetry={onRetry}
      showHome={true}
      showRetry={true}
    />
  );
}

// Permission Error Component
export function PermissionError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      title="Access Denied"
      description="You don't have permission to access this resource. Please log in or contact support."
      showRetry={false}
      showHome={true}
      showBack={true}
      onRetry={onRetry}
    />
  );
}

// Loading Error Component
export function LoadingError({ 
  resource = 'content',
  onRetry 
}: { 
  resource?: string;
  onRetry?: () => void;
}) {
  return (
    <ErrorDisplay
      title="Loading Failed"
      description={`Failed to load ${resource}. Please check your connection and try again.`}
      onRetry={onRetry}
      showHome={false}
      showRetry={true}
    />
  );
}

// Error Boundary Class Component
export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error={this.state.error || undefined}
          title="Application Error"
          description="The application encountered an unexpected error. Please refresh the page or try again later."
          onRetry={this.handleReset}
          showHome={true}
          showRetry={true}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for handling async errors
export function useErrorHandler() {
  const navigate = useNavigate();

  const handleError = (error: any, fallbackPath?: string) => {
    console.error('Error occurred:', error);

    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          navigate('/login', { 
            state: { message: 'Please log in to continue' } 
          });
          break;
        case 403:
          // Forbidden - show permission error
          navigate('/error', { 
            state: { 
              type: 'permission',
              message: 'You don\'t have permission to access this resource' 
            } 
          });
          break;
        case 404:
          // Not found
          navigate('/error', { 
            state: { 
              type: 'notfound',
              message: 'The requested resource was not found' 
            } 
          });
          break;
        case 500:
        case 502:
        case 503:
          // Server errors
          navigate('/error', { 
            state: { 
              type: 'server',
              message: 'Server error occurred. Please try again later.' 
            } 
          });
          break;
        default:
          // Generic error
          if (fallbackPath) {
            navigate(fallbackPath);
          } else {
            navigate('/error', { 
              state: { 
                type: 'generic',
                message: error.response.data?.message || 'An unexpected error occurred' 
              } 
            });
          }
      }
    } else if (error.request) {
      // Network error
      navigate('/error', { 
        state: { 
          type: 'network',
          message: 'Network error. Please check your connection.' 
        } 
      });
    } else {
      // Generic error
      navigate('/error', { 
        state: { 
          type: 'generic',
          message: error.message || 'An unexpected error occurred' 
        } 
      });
    }
  };

  return { handleError };
}

// Retry wrapper for async operations
export function withRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3,
  delay: number = 1000
) {
  return async (...args: T): Promise<R> => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError!;
  };
}
