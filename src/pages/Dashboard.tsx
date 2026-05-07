import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import { useAuth, UserData } from '../components/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { PartyPopper, Plus, Calendar, MapPin, ChevronRight, LogOut, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteDoc, doc } from 'firebase/firestore';

export default function Dashboard() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const fetchInvitations = async () => {
      try {
        const q = query(collection(db, 'invitations'), where('ownerId', '==', currentUser.uid));
        const qs = await getDocs(q);
        const invs = qs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInvitations(invs);
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'invitations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvitations();
  }, [currentUser]);

  const handleDeleteEvent = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!confirm('¿Estás seguro de que quieres eliminar esta invitación? Esta acción no se puede deshacer.')) return;
    try {
      await deleteDoc(doc(db, 'invitations', id));
      setInvitations(prev => prev.filter(inv => inv.id !== id));
      toast.success('Invitación eliminada');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleCreate = async () => {
    if (!currentUser) return;
    setIsCreating(true);
    
    const randomSlug = Math.random().toString(36).substring(2, 10);
    try {
      const docRef = await addDoc(collection(db, 'invitations'), {
        ownerId: currentUser.uid,
        slug: randomSlug,
        title: 'Mi Nuevo Evento',
        date: serverTimestamp(),
        venue: 'Por definir',
        theme: 'minimalist',
        active: true,
        welcomeMessage: '¡Estamos felices de invitarte a celebrar con nosotros!',
        createdAt: serverTimestamp()
      });
      
      toast.success('Invitación creada');
      navigate(`/dashboard/${docRef.id}`);
    } catch (e) {
      toast.error('Error al crear la invitación');
      handleFirestoreError(e, OperationType.CREATE, 'invitations');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans text-brand-dark">
      <header className="bg-white border-b border-brand-soft py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2 text-brand-main font-serif font-bold text-2xl">
          <PartyPopper className="h-6 w-6" />
          <span>Celebrae</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 mr-4 text-sm font-medium">
             <span className="bg-brand-bg px-3 py-1 rounded-full border border-brand-soft shadow-sm text-brand-dark">
               Plan {userData?.plan === 'pro' ? 'Premium ✦' : userData?.plan === 'basic' ? 'Básico' : 'Esencial'}
             </span>
          </div>
          <span className="font-medium text-sm hidden md:block opacity-80">{currentUser?.email}</span>
          <button onClick={handleLogout} className="p-2 text-brand-dark hover:text-brand-main hover:bg-brand-bg rounded-full transition-colors" title="Cerrar sesión">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Mis Eventos</h1>
            <p className="text-brand-dark/70 font-light">Gestiona tus celebraciones y listas de invitados</p>
          </div>
          <button 
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center gap-2 bg-brand-main text-white px-6 py-3 rounded-full font-bold hover:bg-brand-main/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            {isCreating ? <span className="animate-spin text-xl">⟳</span> : <Plus className="w-5 h-5" />}
            <span>Nuevo Evento</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <span className="animate-spin text-brand-main text-3xl">⟳</span>
          </div>
        ) : invitations.length === 0 ? (
          <div className="bg-white border-[0.5px] border-brand-soft rounded-[24px] p-16 text-center flex flex-col items-center shadow-lg shadow-brand-soft/20">
            <PartyPopper className="w-20 h-20 text-brand-soft mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-3">Aún no tienes celebraciones</h3>
            <p className="text-brand-dark/70 mb-8 max-w-md font-light leading-relaxed">Crea tu primera invitación para empezar a recibir confirmaciones y organizar las mesas de tus invitados de forma impecable.</p>
            <button 
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-brand-dark/90 transition-colors text-lg"
            >
              Diseñar mi primera invitación
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {invitations.map(inv => (
              <Link to={`/dashboard/${inv.id}`} key={inv.id} className="bg-white rounded-[14px] border-[0.5px] border-brand-soft overflow-hidden hover:shadow-xl hover:shadow-brand-soft/50 transition-all hover:-translate-y-1 block group">
                <div className="h-40 bg-brand-bg relative overflow-hidden flex items-center justify-center">
                  {inv.coverImageUrl ? (
                    <img src={inv.coverImageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-bg to-brand-soft" />
                  )}
                  {inv.active === false && (
                     <div className="absolute top-3 left-3 bg-white/90 text-brand-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">Borrador</div>
                  )}
                  <button onClick={(e) => handleDeleteEvent(e, inv.id)} className="absolute top-3 right-3 bg-white/90 text-red-500 p-2 rounded-full backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50" title="Eliminar evento">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold mb-3 truncate group-hover:text-brand-main transition-colors">{inv.title}</h3>
                  <div className="space-y-3 mb-6 font-light">
                    <div className="flex items-center text-sm opacity-80">
                      <Calendar className="w-4 h-4 mr-3 text-brand-medium" />
                      {inv.date?.seconds ? new Date(inv.date.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'}) : 'Fecha por definir'}
                    </div>
                    <div className="flex items-center text-sm opacity-80">
                      <MapPin className="w-4 h-4 mr-3 text-brand-medium" />
                      <span className="truncate">{inv.venue}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-brand-main text-sm font-bold border-t border-brand-bg pt-4 mt-2">
                    Gestionar celebración
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
