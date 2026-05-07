import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, PartyPopper, Check, Gift, Camera, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DemoInvitation() {
  const [submittingRsvp, setSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const invitation = {
    title: "Boda de Ana & Carlos",
    date: { seconds: new Date("2026-12-20T20:00:00Z").getTime() / 1000 },
    venue: "Hacienda Los Arcángeles",
    coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    welcomeMessage: "Nos llena de alegría invitarte a compartir con nosotros el día más importante de nuestras vidas.\n¡Prepárate para una noche inolvidable!"
  };

  const [registryItems, setRegistryItems] = useState([
    { id: '1', title: 'Aportación para Luna de Miel', url: 'https://example.com', reserved: false },
    { id: '2', title: 'Juego de Vajilla de Cerámica', url: 'https://example.com', reserved: true, reservedBy: 'Familia Gómez' }
  ]);

  const [galleryPhotos, setGalleryPhotos] = useState([
    { id: '1', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400', uploadedBy: 'Laura' },
    { id: '2', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=400', uploadedBy: 'Diego' }
  ]);

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRsvp(true);
    
    // Simulate network delay
    setTimeout(() => {
      setSubmittingRsvp(false);
      setRsvpSuccess(true);
      toast.success('¡Demo: Confirmación exitosa!', { icon: '🎉' });
    }, 1200);
  };

  const handleReserveGift = (itemId: string) => {
    const name = window.prompt("¿Cuál es tu nombre? (Para marcarlo como reservado por ti)");
    if (!name) return;
    
    setRegistryItems(items => items.map(item => 
      item.id === itemId ? { ...item, reserved: true, reservedBy: name } : item
    ));
    toast.success('¡Demo: Regalo reservado con éxito!', { icon: '🎁' });
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fileInput = form.imageFile as HTMLInputElement;
    const by = form.uploaderName.value;
    
    if (!fileInput.files || fileInput.files.length === 0 || !by) {
      toast.error('Por favor selecciona una foto y escribe tu nombre.');
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to fit within roughly 1MB (max 800x800)
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        setGalleryPhotos(photos => [
          { id: Date.now().toString(), imageUrl: dataUrl, uploadedBy: by },
          ...photos
        ]);
        form.reset();
        toast.success('¡Foto añadida a la galería!', { icon: '📸' });
      };
      img.src = event.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-brand-bg font-serif text-brand-dark pb-20 pt-14">
      {/* Demo Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-brand-dark text-brand-bg px-6 py-3 flex items-center justify-between z-50 shadow-md">
        <Link to="/" className="flex items-center gap-2 hover:text-white transition-colors text-sm font-sans font-medium">
          <ArrowLeft className="w-4 h-4" /> Volver a Celebrae
        </Link>
        <span className="font-sans text-sm font-bold tracking-widest uppercase opacity-80 border border-brand-bg/30 px-3 py-1 rounded-full">
          Modo Demo
        </span>
      </div>

      {/* Hero Image / Banner */}
      <div className="w-full h-screen max-h-[60vh] relative">
        <img src={invitation.coverImageUrl} alt="Boda" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white text-shadow-sm">
          <h1 className="text-5xl sm:text-7xl mb-4 font-normal tracking-wide" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{invitation.title}</h1>
          <p className="text-xl sm:text-2xl opacity-90 font-sans tracking-widest uppercase font-light" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            {new Date(invitation.date.seconds * 1000).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        
        {/* Welcome Message */}
        {invitation.welcomeMessage && (
          <div className="text-center mb-20 text-lg sm:text-xl text-brand-dark/80 leading-relaxed font-sans font-light">
            {invitation.welcomeMessage.split('\n').map((line: string, i: number) => (
              <p key={i} className="mb-2">{line}</p>
            ))}
          </div>
        )}

        {/* Details Card */}
        <div className="bg-white p-8 sm:p-12 rounded-[14px] shadow-xl shadow-brand-soft/50 border-[0.5px] border-brand-soft mb-20">
          <h3 className="text-3xl font-bold mb-10 text-center font-serif tracking-wide">Dónde y Cuándo</h3>
          
          <div className="space-y-8 font-sans">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center text-brand-main shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-brand-dark mb-1 text-lg">Fecha</h4>
                <p className="text-brand-dark/80 font-light">
                  {new Date(invitation.date.seconds * 1000).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center text-brand-main shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-brand-dark mb-1 text-lg">Lugar</h4>
                <p className="text-brand-dark/80 font-light mb-3">{invitation.venue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Form */}
        <div className="bg-brand-soft/20 p-8 sm:p-12 rounded-[14px] mb-20 font-sans shadow-lg shadow-brand-soft/30 relative overflow-hidden border-[0.5px] border-brand-soft">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <PartyPopper className="w-56 h-56 text-brand-main" />
          </div>
          <h3 className="text-3xl font-bold mb-8 text-center text-brand-dark font-serif relative z-10">Confirmar Asistencia (RSVP)</h3>
          
          {rsvpSuccess ? (
            <div className="text-center bg-white p-10 rounded-[14px] shadow-sm relative z-10 border-[0.5px] border-brand-soft">
               <div className="w-20 h-20 bg-brand-soft text-brand-main rounded-full flex items-center justify-center mx-auto mb-6">
                 <Check className="w-10 h-10" />
               </div>
               <h4 className="text-2xl font-bold text-brand-dark mb-2 font-serif">¡Gracias por confirmar!</h4>
               <p className="text-brand-dark/80 font-light">Tu respuesta ha sido registrada exitosamente.</p>
               <p className="text-xs text-brand-main mt-6 font-bold">(Nota: Esto es una demostración)</p>
            </div>
          ) : (
            <form onSubmit={handleRsvp} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">Nombre completo</label>
                <input required type="text" name="fullName" className="w-full px-5 py-4 rounded-[14px] border border-brand-soft focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all ml-0" placeholder="Ej: Juan Pérez" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">¿Asistirás?</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center justify-center gap-3 p-4 bg-white border border-brand-soft rounded-[14px] cursor-pointer hover:bg-brand-soft/50 transition-colors">
                    <input required type="radio" name="attending" value="yes" className="w-4 h-4 text-brand-main focus:ring-brand-main" />
                    <span className="font-bold text-brand-dark">¡Sí, ahí estaré!</span>
                  </label>
                  <label className="flex items-center justify-center gap-3 p-4 bg-white border border-brand-soft rounded-[14px] cursor-pointer hover:bg-brand-soft/50 transition-colors">
                    <input required type="radio" name="attending" value="no" className="w-4 h-4 text-brand-main focus:ring-brand-main" />
                    <span className="font-bold text-brand-dark">No podré</span>
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">Número de invitados en tu grupo</label>
                  <input required min="1" max="10" type="number" name="guestsCount" defaultValue="1" className="w-full px-5 py-4 rounded-[14px] border border-brand-soft focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">Nombres de acompañantes</label>
                  <input type="text" name="companionNames" placeholder="Opcional" className="w-full px-5 py-4 rounded-[14px] border border-brand-soft focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2 uppercase tracking-wider">Mensaje para los anfitriones</label>
                <textarea name="message" rows={3} placeholder="Algún requerimiento alimenticio o mensaje..." className="w-full px-5 py-4 rounded-[14px] border border-brand-soft focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all resize-none"></textarea>
              </div>

              <button disabled={submittingRsvp} type="submit" className="w-full py-4 mt-4 bg-brand-main text-white rounded-full font-bold text-lg hover:bg-brand-main/90 transition-colors shadow-lg shadow-brand-main/30 disabled:opacity-50">
                {submittingRsvp ? 'Enviando...' : 'Confirmar Asistencia'}
              </button>
            </form>
          )}
        </div>

        {/* Registry Section */}
        {registryItems.length > 0 && (
          <div className="mb-20 font-sans">
            <h3 className="text-3xl font-bold mb-10 text-center text-brand-dark font-serif flex items-center justify-center gap-3">
              <Gift className="text-brand-main" /> Mesa de Regalos
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {registryItems.map(item => (
                <div key={item.id} className="bg-white border-[0.5px] border-brand-soft p-6 rounded-[14px] shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                  <div className="mb-6">
                    <h4 className="font-bold text-lg text-brand-dark mb-2">{item.title}</h4>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-brand-main font-bold text-sm hover:underline flex items-center gap-1">Ver en tienda &rarr;</a>
                    )}
                  </div>
                  {item.reserved ? (
                    <div className="bg-brand-bg text-brand-dark/70 px-4 py-3 rounded-full text-sm font-bold text-center mt-auto border border-brand-soft">
                      Reservado por {item.reservedBy}
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleReserveGift(item.id)}
                      className="bg-brand-dark hover:bg-brand-dark/90 text-white px-4 py-3 rounded-full text-sm font-bold transition-colors mt-auto w-full shadow-sm"
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
          <h3 className="text-3xl font-bold mb-10 text-center text-brand-dark font-serif flex items-center justify-center gap-3">
             <Camera className="text-brand-main" /> Galería del Evento
          </h3>
          
          <form onSubmit={handleAddPhoto} className="bg-white p-6 sm:p-8 rounded-[14px] shadow-sm border-[0.5px] border-brand-soft mb-10 flex flex-col sm:flex-row gap-4 items-end">
             <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-brand-dark mb-2 uppercase tracking-wider">Elige tu foto</label>
                <input required type="file" accept="image/*" name="imageFile" className="w-full px-4 py-3 border border-brand-soft rounded-[14px] focus:ring-2 focus:ring-brand-main outline-none text-sm bg-brand-bg/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-brand-soft file:text-brand-dark hover:file:bg-brand-medium transition-all" />
             </div>
             <div className="flex-1 w-full sm:max-w-[200px]">
                <label className="block text-xs font-bold text-brand-dark mb-2 uppercase tracking-wider">Tu Nombre</label>
                <input required type="text" name="uploaderName" placeholder="Ej: Carlos" className="w-full px-4 py-3 border border-brand-soft rounded-[14px] focus:ring-2 focus:ring-brand-main outline-none text-sm bg-brand-bg/50" />
             </div>
             <button type="submit" className="w-full sm:w-auto bg-brand-main text-white px-8 py-3 rounded-full font-bold hover:bg-brand-main/90 transition-colors h-[46px] text-sm flex items-center justify-center shadow-md">
               Subir Foto
             </button>
          </form>

          {galleryPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {galleryPhotos.map((photo) => (
                <div key={photo.id} className="aspect-square bg-brand-bg rounded-[14px] overflow-hidden shadow-sm border-[0.5px] border-brand-soft relative group">
                  <img src={photo.imageUrl} alt="Momento del evento" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                     <span className="text-white text-sm font-bold truncate">Por: {photo.uploadedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-brand-dark/60 bg-brand-bg/50 border border-brand-soft border-dashed rounded-[14px]">
              ¡Sé el primero en subir una foto de este evento!
            </div>
          )}
        </div>
      </div>
      
      <footer className="text-center py-12 text-sm text-brand-dark/60 font-sans border-t border-brand-soft mt-20">
        Demo de Invitación por <Link to="/" className="font-bold text-brand-main hover:text-brand-main/80">Celebrae</Link>
      </footer>
    </div>
  );
}
