import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, updateDoc, collection, onSnapshot, addDoc, deleteDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';
import { PartyPopper, Users, Gift, Image as ImageIcon, Settings, QrCode as QrIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardInvitation() {
  const { invitationId } = useParams();
  const [invitation, setInvitation] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (!invitationId) return;

    const unsub = onSnapshot(doc(db, 'invitations', invitationId), (docSnap) => {
      if (docSnap.exists()) {
        setInvitation({ id: docSnap.id, ...docSnap.data() });
      } else {
        toast.error('Invitación no encontrada');
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `invitations/${invitationId}`);
    });

    return unsub;
  }, [invitationId]);

  if (!invitation) {
    return <div className="min-h-screen bg-brand-bg flex items-center justify-center p-12"><span className="animate-spin text-brand-main text-3xl">⟳</span></div>;
  }

  const publicUrl = `${window.location.origin}/i/${invitation.slug}`;

  // Simple tabs routing
  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsTab invitation={invitation} publicUrl={publicUrl} />;
      case 'rsvps':
        return <RsvpsTab invitationId={invitation.id} />;
      case 'tables':
        return <TablesTab invitationId={invitation.id} />;
      case 'registry':
        return <RegistryTab invitationId={invitation.id} />;
      case 'gallery':
        return <GalleryTab invitationId={invitation.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      <header className="bg-white border-b border-brand-soft py-4 px-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-brand-dark/70 hover:text-brand-main transition-colors font-medium">Volver</Link>
          <div className="h-4 w-[1px] bg-brand-soft" />
          <h1 className="font-bold text-brand-dark font-serif text-xl truncate max-w-[200px] sm:max-w-md">{invitation.title}</h1>
        </div>
        <a 
          href={publicUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-bold text-brand-main hover:text-white bg-brand-soft hover:bg-brand-main px-4 py-2 rounded-full transition-colors"
        >
          Ver Pública
        </a>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          <TabButton icon={<Settings className="w-5 h-5"/>} label="Detalles del Evento" active={activeTab === 'details'} onClick={() => setActiveTab('details')} />
          <TabButton icon={<Users className="w-5 h-5"/>} label="Invitados (RSVP)" active={activeTab === 'rsvps'} onClick={() => setActiveTab('rsvps')} />
          <TabButton icon={<PartyPopper className="w-5 h-5"/>} label="Acomodo de Mesas" active={activeTab === 'tables'} onClick={() => setActiveTab('tables')} />
          <TabButton icon={<Gift className="w-5 h-5"/>} label="Mesa de Regalos" active={activeTab === 'registry'} onClick={() => setActiveTab('registry')} />
          <TabButton icon={<ImageIcon className="w-5 h-5"/>} label="Galería Compartida" active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-left font-bold transition-colors ${active ? 'bg-white text-brand-main shadow-md shadow-brand-soft/50 border border-brand-soft' : 'text-brand-dark hover:bg-white/60'}`}
    >
      {icon}
      {label}
    </button>
  );
}

function DetailsTab({ invitation, publicUrl }: { invitation: any, publicUrl: string }) {
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    // Parse date if provided
    let dateValue = invitation.date;
    if (form.eventDate.value) {
      dateValue = new Date(form.eventDate.value);
    }

    try {
      await updateDoc(doc(db, 'invitations', invitation.id), {
        title: (form.title as unknown as HTMLInputElement).value,
        venue: form.venue.value,
        slug: form.slug.value,
        welcomeMessage: form.welcomeMessage.value,
        mapsUrl: form.mapsUrl.value,
        coverImageUrl: form.coverImageUrl.value,
        date: dateValue
      });
      toast.success('Cambios guardados');
    } catch(e) {
      toast.error('Error al guardar');
    }
  };

  // Format date for datetime-local input
  let formattedDate = '';
  if (invitation.date?.seconds) {
    const d = new Date(invitation.date.seconds * 1000);
    formattedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,16);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[14px] border-[0.5px] border-brand-soft shadow-lg shadow-brand-soft/20">
        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-2">
          Compartir Invitación
        </h2>
        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          <div className="p-4 bg-white border border-brand-soft rounded-2xl shadow-sm">
            <QRCode value={publicUrl} size={130} level="M" fgColor="#7C3A50" />
            <div className="text-center mt-3 text-xs text-brand-dark/70 font-medium flex items-center justify-center gap-1">
              <QrIcon className="w-3 h-3"/> Escanea
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <p className="text-brand-dark/80 font-light leading-relaxed">Envía este enlace a tus invitados para que puedan ver los detalles de tu celebración, confirmar asistencia y compartir la alegría contigo.</p>
            <div className="flex border border-brand-soft rounded-full overflow-hidden bg-brand-bg shadow-inner">
              <input type="text" readOnly value={publicUrl} className="flex-1 bg-transparent px-5 py-3 text-sm text-brand-dark focus:outline-none" />
              <button 
                onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success('Enlace copiado'); }}
                className="bg-brand-main px-6 font-bold text-sm text-white hover:bg-brand-main/90 transition-colors"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[14px] border-[0.5px] border-brand-soft shadow-lg shadow-brand-soft/20">
        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">Información Básica</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Título del Evento</label>
              <input type="text" name="title" defaultValue={invitation.title} className="w-full px-4 py-3 rounded-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Enlace Personalizado (Slug)</label>
              <div className="flex items-stretch relative">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-brand-soft bg-brand-soft/30 text-brand-dark/60 sm:text-sm font-medium">/i/</span>
                <input type="text" name="slug" defaultValue={invitation.slug} className="flex-1 px-4 py-3 rounded-r-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main z-10 outline-none transition-all" />
              </div>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Fecha y Hora</label>
              <input type="datetime-local" name="eventDate" defaultValue={formattedDate} className="w-full px-4 py-3 rounded-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all min-h-[46px]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Imagen de Portada (URL)</label>
              <input type="url" name="coverImageUrl" defaultValue={invitation.coverImageUrl || ''} placeholder="https://ejemplo.com/foto.jpg" className="w-full px-4 py-3 rounded-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Lugar (Venue)</label>
              <input type="text" name="venue" defaultValue={invitation.venue} className="w-full px-4 py-3 rounded-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-dark mb-2">Enlace de Google Maps</label>
              <input type="url" name="mapsUrl" defaultValue={invitation.mapsUrl || ''} placeholder="https://maps.google.com/..." className="w-full px-4 py-3 rounded-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all" />
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-brand-dark mb-2">Mensaje de Bienvenida</label>
             <textarea name="welcomeMessage" defaultValue={invitation.welcomeMessage} rows={4} className="w-full px-4 py-3 rounded-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all resize-none"></textarea>
          </div>

          <div className="pt-6 border-t border-brand-soft/50 flex justify-end">
            <button type="submit" className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark/90 transition-colors shadow-md shadow-brand-dark/20">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RsvpsTab({ invitationId }: { invitationId: string }) {
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `invitations/${invitationId}/rsvp_responses`), (snapshot) => {
      setRsvps(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [invitationId]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `invitations/${invitationId}/tables`), (snapshot) => {
      setTables(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [invitationId]);

  const handleDeleteRsvp = async (rsvpId: string) => {
    if (!confirm('¿Seguro de eliminar este registro?')) return;
    try {
      await deleteDoc(doc(db, `invitations/${invitationId}/rsvp_responses/${rsvpId}`));
      toast.success('Registro eliminado');
    } catch(e) {
      toast.error('Error al eliminar');
    }
  };

  const handleAssignTable = async (rsvpId: string, tableId: string) => {
    try {
      await updateDoc(doc(db, `invitations/${invitationId}/rsvp_responses/${rsvpId}`), {
        tableId: tableId === '' ? null : tableId
      });
      toast.success('Mesa asignada');
    } catch(e) {
      toast.error('Error al asignar mesa');
    }
  };

  return (
    <div className="bg-white rounded-[14px] border-[0.5px] border-brand-soft overflow-hidden shadow-lg shadow-brand-soft/20">
      <div className="p-8 border-b border-brand-soft/50 flex justify-between items-center bg-brand-bg/30">
        <h2 className="text-2xl font-serif font-bold text-brand-dark">Lista de Invitados</h2>
        <div className="bg-brand-main text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
          {rsvps.reduce((acc, r) => acc + (r.attending === 'yes' ? (r.guests || 1) : 0), 0)} confirmados
        </div>
      </div>
      {rsvps.length === 0 ? (
        <div className="p-16 text-center text-brand-dark/60 font-light text-lg">Nadie ha confirmado asistencia aún.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-brand-soft/30 border-b border-brand-soft/50 text-xs uppercase text-brand-dark/70 font-bold tracking-wider">
              <tr>
                <th className="px-8 py-4">Nombre</th>
                <th className="px-8 py-4">Asiste</th>
                <th className="px-8 py-4">Mesa</th>
                <th className="px-8 py-4">Total personas</th>
                <th className="px-8 py-4">Acompañantes</th>
                <th className="px-8 py-4">Mensaje</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-soft/30 text-sm font-medium text-brand-dark">
              {rsvps.map(r => (
                <tr key={r.id} className="hover:bg-brand-bg/50 transition-colors group">
                  <td className="px-8 py-5 font-bold">{r.name}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${r.attending === 'yes' ? 'bg-[#E8F5E9] text-[#2E7D32]' : r.attending === 'no' ? 'bg-[#FFEBEE] text-[#C62828]' : 'bg-brand-champagne text-brand-dark'}`}>
                      {r.attending === 'yes' ? 'Sí' : r.attending === 'no' ? 'No' : 'Tal vez'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                     {r.attending === 'yes' && (
                        <select 
                          className="bg-transparent border border-brand-soft rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-brand-main"
                          value={r.tableId || ''}
                          onChange={(e) => handleAssignTable(r.id, e.target.value)}
                        >
                          <option value="">Sin mesa</option>
                          {tables.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                     )}
                  </td>
                  <td className="px-8 py-5">{r.guests || 1}</td>
                  <td className="px-8 py-5 text-brand-dark/70 max-w-[200px] truncate">{r.companionNames || '-'}</td>
                  <td className="px-8 py-5 text-brand-dark/70 max-w-[200px] truncate">{r.message || '-'}</td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => handleDeleteRsvp(r.id)} className="p-2 text-red-500 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50" title="Eliminar registro">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TablesTab({ invitationId }: { invitationId: string }) {
  const [tables, setTables] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `invitations/${invitationId}/tables`), (snapshot) => {
      setTables(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [invitationId]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `invitations/${invitationId}/rsvp_responses`), (snapshot) => {
      setRsvps(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [invitationId]);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName || !newTableCapacity) return;
    try {
      await addDoc(collection(db, `invitations/${invitationId}/tables`), {
        name: newTableName,
        capacity: parseInt(newTableCapacity) || 8
      });
      setNewTableName('');
      setNewTableCapacity('');
      toast.success('Mesa agregada');
    } catch(e) {
      toast.error('Error al agregar mesa');
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    if (!confirm('¿Eliminar esta mesa?')) return;
    try {
      await deleteDoc(doc(db, `invitations/${invitationId}/tables/${tableId}`));
      toast.success('Mesa eliminada');
    } catch(e) {
      toast.error('Error al eliminar');
    }
  };

  // Helper to calculate used seats
  const getUsedSeats = (tableId: string) => {
    return rsvps.filter(r => r.tableId === tableId && r.attending === 'yes')
                .reduce((acc, r) => acc + (r.guests || 1), 0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[14px] border-[0.5px] border-brand-soft shadow-lg shadow-brand-soft/20">
        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-2">Acomodo de Mesas</h2>
        <form onSubmit={handleAddTable} className="flex gap-4 mb-10 flex-col sm:flex-row">
          <input type="text" placeholder="Nombre (Ej. Familia Pérez)" value={newTableName} onChange={(e) => setNewTableName(e.target.value)} className="flex-1 px-4 py-3 rounded-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all" required />
          <input type="number" placeholder="Sillas" value={newTableCapacity} onChange={(e) => setNewTableCapacity(e.target.value)} className="w-full sm:w-28 px-4 py-3 rounded-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all" required />
          <button type="submit" className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark/90 transition-colors">Agregar</button>
        </form>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map(table => {
            const usedSeats = getUsedSeats(table.id);
            const remaining = table.capacity - usedSeats;
            const isFull = remaining <= 0;
            return (
              <div key={table.id} className="border-[0.5px] border-brand-soft rounded-2xl p-6 bg-brand-bg flex justify-between items-start shadow-sm group">
                <div>
                  <h4 className="font-bold text-brand-dark text-lg mb-1">{table.name}</h4>
                  <p className="text-sm font-medium text-brand-dark/70 mb-2">Capacidad: {table.capacity} personas</p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isFull ? 'bg-[#FFEBEE] text-[#C62828]' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isFull ? 'bg-[#C62828]' : 'bg-[#2E7D32]'}`}></div>
                    {isFull ? 'Llena' : `${remaining} lugares disp.`} 
                  </div>
                </div>
                <button onClick={() => handleDeleteTable(table.id)} className="p-2 text-red-500 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50" title="Eliminar mesa">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {tables.length === 0 && (
             <div className="col-span-full py-16 text-center text-brand-dark/60 font-light text-lg">Aún no has agregado mesas.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function RegistryTab({ invitationId }: { invitationId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `invitations/${invitationId}/registry_items`), (snapshot) => {
      setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [invitationId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      await addDoc(collection(db, `invitations/${invitationId}/registry_items`), {
        title,
        url,
        reserved: false
      });
      setTitle('');
      setUrl('');
      toast.success('Regalo agregado');
    } catch(e) {
      toast.error('Error al agregar regalo');
    }
  };

  const handleDeleteGift = async (itemId: string) => {
    if (!confirm('¿Eliminar este regalo?')) return;
    try {
      await deleteDoc(doc(db, `invitations/${invitationId}/registry_items/${itemId}`));
      toast.success('Regalo eliminado');
    } catch(e) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[14px] border-[0.5px] border-brand-soft shadow-lg shadow-brand-soft/20">
        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">Mesa de Regalos</h2>
        <form onSubmit={handleAddItem} className="flex gap-4 mb-10 flex-col sm:flex-row">
          <input type="text" placeholder="Nombre del regalo" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 px-4 py-3 rounded-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all" required />
          <input type="url" placeholder="Enlace (opcional)" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 px-4 py-3 rounded-lg border border-brand-soft bg-brand-bg/50 focus:bg-white focus:ring-2 focus:ring-brand-main focus:border-brand-main outline-none transition-all" />
          <button type="submit" className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark/90 transition-colors">Agregar</button>
        </form>

        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-[0.5px] border-brand-soft rounded-[14px] bg-brand-bg/30 group relative">
              <div className="mb-3 sm:mb-0">
                <h4 className="font-bold text-brand-dark text-lg mb-1">{item.title}</h4>
                {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-brand-main hover:underline">Ver en tienda &rarr;</a>}
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider ${item.reserved ? 'bg-brand-soft text-brand-dark' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
                  {item.reserved ? 'Reservado' : 'Disponible'}
                </span>
                <button onClick={() => handleDeleteGift(item.id)} className="p-2 text-red-500 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50" title="Eliminar regalo">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="py-16 text-center text-brand-dark/60 font-light text-lg">Tu mesa de regalos está vacía.</div>}
        </div>
      </div>
    </div>
  );
}

function GalleryTab({ invitationId }: { invitationId: string }) {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `invitations/${invitationId}/gallery_photos`), (snapshot) => {
      setPhotos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [invitationId]);

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('¿Eliminar esta foto de la galería?')) return;
    try {
      await deleteDoc(doc(db, `invitations/${invitationId}/gallery_photos/${photoId}`));
      toast.success('Foto eliminada');
    } catch(e) {
      toast.error('Error al eliminar foto');
    }
  };

  return (
    <div className="bg-white p-8 rounded-[14px] border-[0.5px] border-brand-soft shadow-lg shadow-brand-soft/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-brand-dark">Galería Compartida</h2>
      </div>
      <div className="bg-brand-champagne/30 text-brand-dark/80 p-5 rounded-2xl mb-8 font-light leading-relaxed border-[0.5px] border-brand-champagne">
        Tus invitados verán la opción de subir fotos en el enlace público de la invitación. Las fotos aparecerán aquí en tiempo real, creando un álbum colaborativo de tu celebración.
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {photos.map(photo => (
          <div key={photo.id} className="aspect-square bg-brand-bg rounded-2xl overflow-hidden relative group shadow-sm border-[0.5px] border-brand-soft">
            <img src={photo.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
               <span className="text-white text-xs font-bold truncate">Por: {photo.uploadedBy}</span>
            </div>
            <button onClick={() => handleDeletePhoto(photo.id)} className="absolute top-2 right-2 p-2 text-white bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500" title="Eliminar foto">
               <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full py-20 text-center text-brand-dark/60 font-light text-lg border-2 border-dashed border-brand-soft rounded-3xl">
            Aún no hay fotos en la galería.
          </div>
        )}
      </div>
    </div>
  );
}
