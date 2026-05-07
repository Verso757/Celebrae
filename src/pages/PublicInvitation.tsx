import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { Calendar, MapPin, PartyPopper, Check, Gift, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublicInvitation() {
  const { slug } = useParams();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Subs
  const [registryItems, setRegistryItems] = useState<any[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    const loadInvitation = async () => {
      try {
        const q = query(collection(db, 'invitations'), where('slug', '==', slug), where('active', '==', true));
        const qs = await getDocs(q);
        if (qs.empty) {
          setError('Invitación no encontrada o inactiva.');
        } else {
          setInvitation({ id: qs.docs[0].id, ...qs.docs[0].data() });
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.LIST, 'invitations');
        setError('Error al cargar la invitación.');
      } finally {
        setLoading(false);
      }
    };
    loadInvitation();
  }, [slug]);

  useEffect(() => {
    if (!invitation) return;
    
    const unsubR = onSnapshot(collection(db, `invitations/${invitation.id}/registry_items`), (snap) => {
      setRegistryItems(snap.docs.map(d => ({id: d.id, ...d.data()})));
    });
    
    const unsubG = onSnapshot(collection(db, `invitations/${invitation.id}/gallery_photos`), (snap) => {
      setGalleryPhotos(snap.docs.map(d => ({id: d.id, ...d.data()})));
    });

    return () => { unsubR(); unsubG(); };
  }, [invitation]);

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation) return;
    
    setSubmittingRsvp(true);
    const form = e.target as HTMLFormElement;
    
    try {
      await addDoc(collection(db, `invitations/${invitation.id}/rsvp_responses`), {
        name: form.fullName.value,
        attending: form.attending.value,
        guests: parseInt(form.guestsCount.value) || 1,
        companionNames: form.companionNames.value || '',
        message: form.message.value || '',
        createdAt: serverTimestamp()
      });
      setRsvpSuccess(true);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `invitations/${invitation.id}/rsvp_responses`);
      toast.error('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setSubmittingRsvp(false);
    }
  };

  const handleReserveGift = async (itemId: string) => {
    const name = window.prompt("¿Cuál es tu nombre? (Para marcarlo como reservado por ti)");
    if (!name) return;
    try {
      await updateDoc(doc(db, `invitations/${invitation.id}/registry_items/${itemId}`), {
        reserved: true,
        reservedBy: name
      });
      toast.success('¡Gracias por tu regalo!');
    } catch(e) {
      toast.error('Error al reservar el regalo.');
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const url = form.imageUrl.value;
    const by = form.uploaderName.value;
    if (!url || !by) return;

    try {
      await addDoc(collection(db, `invitations/${invitation.id}/gallery_photos`), {
        imageUrl: url,
        uploadedBy: by,
        createdAt: serverTimestamp()
      });
      form.reset();
      toast.success('Foto añadida a la galería');
    } catch(err) {
      toast.error('Error al subir la foto');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb]"><span className="animate-spin text-rose-500 text-3xl">⟳</span></div>;
  if (error || !invitation) return <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] text-gray-500">{error}</div>;

  // Render a minimal/elegant template
  return (
    <div className="min-h-screen bg-[#fdfcfb] font-serif text-gray-800 pb-20">
      {/* Hero Image / Banner */}
      <div className="w-full h-screen max-h-[60vh] relative">
        {invitation.coverImageUrl ? (
          <img src={invitation.coverImageUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center">
            <span className="text-rose-200">
              <PartyPopper className="w-24 h-24 opacity-50" />
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20" /> {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white text-shadow-sm">
          <h1 className="text-5xl sm:text-7xl mb-4 font-normal tracking-wide" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{invitation.title}</h1>
          <p className="text-xl sm:text-2xl opacity-90 font-sans tracking-widest uppercase" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {invitation.date?.seconds ? new Date(invitation.date.seconds * 1000).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) : 'Fecha por definir'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        
        {/* Welcome Message */}
        {invitation.welcomeMessage && (
          <div className="text-center mb-20 text-lg sm:text-xl text-gray-600 leading-relaxed font-sans font-light">
            {invitation.welcomeMessage.split('\\n').map((line: string, i: number) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        )}

        {/* Details Card */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 mb-20">
          <h3 className="text-2xl font-bold mb-8 text-center font-sans tracking-wide">Dónde y Cuándo</h3>
          
          <div className="space-y-8 font-sans">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Fecha</h4>
                <p className="text-gray-600">
                  {invitation.date?.seconds ? new Date(invitation.date.seconds * 1000).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) : 'Fecha por definir'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Lugar</h4>
                <p className="text-gray-600 mb-3">{invitation.venue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Form */}
        <div className="bg-rose-50 p-8 sm:p-12 rounded-3xl mb-20 font-sans shadow-lg shadow-rose-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <PartyPopper className="w-48 h-48" />
          </div>
          <h3 className="text-3xl font-bold mb-8 text-center text-rose-950 font-serif relative z-10">Confirmar Asistencia (RSVP)</h3>
          
          {rsvpSuccess ? (
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm relative z-10">
               <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Check className="w-8 h-8" />
               </div>
               <h4 className="text-xl font-bold text-gray-900 mb-2">¡Gracias por confirmar!</h4>
               <p className="text-gray-600">Tu respuesta ha sido registrada exitosamente.</p>
            </div>
          ) : (
            <form onSubmit={handleRsvp} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-semibold text-rose-900 mb-2">Nombre completo</label>
                <input required type="text" name="fullName" className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all ml-0" placeholder="Ej: Juan Pérez" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-rose-900 mb-2">¿Asistirás?</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center gap-2 p-3 bg-white border border-rose-200 rounded-xl cursor-pointer hover:bg-rose-100 transition-colors">
                    <input required type="radio" name="attending" value="yes" className="text-rose-500 focus:ring-rose-500" />
                    <span className="font-medium text-rose-900">¡Sí, ahí estaré!</span>
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 bg-white border border-rose-200 rounded-xl cursor-pointer hover:bg-rose-100 transition-colors">
                    <input required type="radio" name="attending" value="no" className="text-rose-500 focus:ring-rose-500" />
                    <span className="font-medium text-rose-900">No podré</span>
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-rose-900 mb-2">Número de invitados en tu grupo</label>
                  <input required min="1" max="10" type="number" name="guestsCount" defaultValue="1" className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-rose-900 mb-2">Nombres de acompañantes</label>
                  <input type="text" name="companionNames" placeholder="Opcional" className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-rose-900 mb-2">Mensaje para los anfitriones</label>
                <textarea name="message" rows={3} placeholder="Algún requerimiento alimenticio o mensaje..." className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"></textarea>
              </div>

              <button disabled={submittingRsvp} type="submit" className="w-full py-4 bg-rose-500 text-white rounded-xl font-bold text-lg hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30 disabled:opacity-50">
                {submittingRsvp ? 'Enviando...' : 'Confirmar Asistencia'}
              </button>
            </form>
          )}
        </div>

        {/* Registry Section */}
        {registryItems.length > 0 && (
          <div className="mb-20 font-sans">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-900 font-serif flex items-center justify-center gap-3">
              <Gift className="text-rose-500" /> Mesa de Regalos
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {registryItems.map(item => (
                <div key={item.id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-full">
                  <div className="mb-4">
                    <h4 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h4>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-rose-500 text-sm hover:underline font-medium">Ver en tienda &rarr;</a>
                    )}
                  </div>
                  {item.reserved ? (
                    <div className="bg-gray-50 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold text-center mt-auto border border-gray-100">
                      Reservado por {item.reservedBy}
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleReserveGift(item.id)}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors mt-auto w-full"
                    >
                      Reservar Regalo
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Section */}
        <div className="font-sans">
          <h3 className="text-2xl font-bold mb-8 text-center text-gray-900 font-serif flex items-center justify-center gap-3">
             <Camera className="text-rose-500" /> Galería del Evento
          </h3>
          
          <form onSubmit={handleAddPhoto} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col sm:flex-row gap-4 items-end">
             <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">URL de tu foto</label>
                <input required type="url" name="imageUrl" placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
             </div>
             <div className="flex-1 w-full sm:max-w-xs">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Tu Nombre</label>
                <input required type="text" name="uploaderName" placeholder="Ej: Carlos" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" />
             </div>
             <button type="submit" className="w-full sm:w-auto bg-rose-500 text-white px-6 py-2 border border-transparent rounded-lg font-semibold hover:bg-rose-600 transition-colors h-[42px]">
               Subir
             </button>
          </form>

          {galleryPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryPhotos.map((photo) => (
                <div key={photo.id} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm relative group">
                  <img src={photo.imageUrl} alt="Momento del evento" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                     <span className="text-white text-sm font-medium">Por: {photo.uploadedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 border border-gray-200 border-dashed rounded-3xl">
              ¡Sé el primero en subir una foto de este evento!
            </div>
          )}
        </div>

      </div>
      
      <footer className="text-center py-12 text-sm text-gray-400 font-sans border-t border-gray-100 mt-20">
        Invitación creada con <a href="/" className="font-semibold text-rose-400 hover:text-rose-500">Celebrae</a>
      </footer>
    </div>
  );
}
