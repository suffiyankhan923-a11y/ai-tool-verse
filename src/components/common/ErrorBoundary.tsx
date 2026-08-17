import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-[#181A20] border border-red-200 dark:border-red-900/50 rounded-2xl p-8 shadow-sm">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[#1F1B18] dark:text-[#F7F5F0] mb-2 font-['Outfit',sans-serif]">Something went wrong</h2>
            <p className="text-sm text-[#756E65] dark:text-[#9E9B96] mb-6">
              An unexpected error occurred while rendering this component.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B5824C] hover:bg-[#9E6F3B] text-white text-sm font-medium transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F4ECE1] dark:bg-[#22252E] hover:bg-[#EAE2D5] dark:hover:bg-[#2C303B] text-[#1F1B18] dark:text-[#F7F5F0] text-sm font-medium transition-colors"
              >
                <Home className="w-4 h-4" />
                Back Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
