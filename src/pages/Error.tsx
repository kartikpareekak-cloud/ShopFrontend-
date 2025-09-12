import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ErrorDisplay, 
  NetworkError, 
  NotFoundError, 
  ServerError, 
  PermissionError 
} from '@/components/ErrorHandling';

interface ErrorState {
  type?: 'network' | 'notfound' | 'server' | 'permission' | 'generic';
  message?: string;
  error?: Error;
}

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as ErrorState | null;
  const errorType = state?.type || 'generic';
  const errorMessage = state?.message;
  const error = state?.error;

  const handleRetry = () => {
    // Go back to the previous page and retry
    navigate(-1);
  };

  switch (errorType) {
    case 'network':
      return <NetworkError onRetry={handleRetry} />;
    
    case 'notfound':
      return <NotFoundError onRetry={handleRetry} />;
    
    case 'server':
      return <ServerError onRetry={handleRetry} />;
    
    case 'permission':
      return <PermissionError onRetry={handleRetry} />;
    
    default:
      return (
        <ErrorDisplay
          error={error}
          title="Something went wrong"
          description={errorMessage || 'An unexpected error occurred. Please try again.'}
          onRetry={handleRetry}
          showHome={true}
          showRetry={true}
          showBack={true}
        />
      );
  }
}
