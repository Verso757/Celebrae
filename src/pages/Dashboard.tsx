import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../components/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { PartyPopper, Plus, Calendar, MapPin, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { currentUser } = useAuth();
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-rose-500 font-bold text-xl">
          <PartyPopper className="h-6 w-6" />
          <span>Celebrae</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium text-sm hidden sm:block">{currentUser?.email}</span>
        </div>
      </header>
      
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Mis Eventos</h1>
            <p className="text-gray-500">Gestiona tus invitaciones y listas de invitados</p>
          </div>
          <button 
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-full font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
          >
            {isCreating ? <span className="animate-spin text-xl">⟳</span> : <Plus className="w-5 h-5" />}
            <span className="hidden sm:inline">Nuevo Evento</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <span className="animate-spin text-rose-500">⟳</span>
          </div>
        ) : invitations.length === 0 ? (
          <div className="bg-white border border-gray-200 border-dashed rounded-3xl p-12 text-center flex flex-col items-center">
            <PartyPopper className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aún no tienes eventos</h3>
            <p className="text-gray-500 mb-6 max-w-md">Crea tu primera invitación para empezar a recibir confirmaciones y organizar tus mesas.</p>
            <button 
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-black transition-colors"
            >
              Crear mi primera invitación
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitations.map(inv => (
              <Link to={`/dashboard/${inv.id}`} key={inv.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 block group">
                <div className="h-32 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  {inv.coverImageUrl ? (
                    <img src={inv.coverImageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-50" />
                  )}
                  {inv.active === false && (
                     <div className="absolute top-2 right-2 bg-gray-900/70 text-white text-xs px-2 py-1 rounded-md font-medium">Borrador</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-rose-600 transition-colors">{inv.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {inv.date?.seconds ? new Date(inv.date.seconds * 1000).toLocaleDateString() : 'Fecha por definir'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{inv.venue}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-rose-500 text-sm font-semibold mt-4">
                    Gestionar evento
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
