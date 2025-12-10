import React, { useState, useEffect } from 'react';
import { X, Chrome, ShieldCheck, Zap, ArrowRight, Loader2 } from 'lucide-react';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleGoogleAuth = () => {
      window.location.href = 'https://storer-xd46.onrender.com/auth/google';
    };

    (window as any).handleGoogleAuth = handleGoogleAuth;
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex min-h-screen items-center p-4 animate-scale-in">
        <div className="absolute top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-black border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E1B4B]/30 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2D1B69]/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>
          {/* Close Button */}
          <button
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="relative p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1E1B4B] to-[#2D1B69] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1E1B4B]/50">
                  <ShieldCheck size={40} className="text-white" strokeWidth={2} />
                </div>
                {/* Pulsing rings */}
                <div className="absolute inset-0 border-2 border-[#1E1B4B]/50 rounded-2xl animate-ping-slow" />
                <div className="absolute inset-0 border border-[#2D1B69]/30 rounded-2xl animate-ping-slow" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to <span className="bg-gradient-to-r from-[#1E1B4B] via-[#2D1B69] to-[#4C1D95] bg-clip-text text-transparent">StoreRadar</span>
              </h2>
              <p className="text-gray-400 text-sm">
                Sign in to access your supplier database, legit checks, and flip lists
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8 bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Zap size={16} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Instant Access</p>
                  <p className="text-gray-400 text-xs">View purchased products immediately</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <ShieldCheck size={16} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Secure & Private</p>
                  <p className="text-gray-400 text-xs">Your data is encrypted and protected</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Chrome size={16} className="text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">One-Click Login</p>
                  <p className="text-gray-400 text-xs">No password to remember</p>
                </div>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={(window as any).handleGoogleAuth}
              disabled={isLoading}
              className="group relative w-full bg-white hover:bg-gray-50 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-lg hover:shadow-xl"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <div className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-6">
              By continuing, you agree to FlipKit&#39;s{' '}
              <a href="#" className="text-[#8B5CF6] hover:text-[#A78BFA] transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#8B5CF6] hover:text-[#A78BFA] transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.15);
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
}