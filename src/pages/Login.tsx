import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { PartyPopper, ArrowLeft } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

export default function Login() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center items-center p-6 font-sans">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-brand-dark hover:text-brand-main transition-colors font-medium">
        <ArrowLeft className="w-5 h-5" /> Volver
      </Link>
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-xl shadow-brand-soft/50 overflow-hidden border border-brand-soft">
        <div className="p-10 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-brand-soft text-brand-main mb-6">
            <PartyPopper className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-2">Bienvenido a Celebrae</h2>
          <p className="text-brand-dark/70 font-light mb-8">Accede para crear y gestionar eventos extraordinarios</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-[0.5px] border-brand-medium hover:bg-brand-bg text-brand-dark font-bold py-4 px-4 rounded-full transition-all disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
}
