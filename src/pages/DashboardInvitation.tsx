import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, updateDoc, collection, onSnapshot, addDoc } from 'firebase/firestore';
import QRCode from 'react-qr-code';
import { PartyPopper, Users, Gift, Image as ImageIcon, Settings, QrCode as QrIcon } from 'lucide-react';
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
    return <div className="min-h-screen flex items-center justify-center p-12"><span className="animate-spin text-rose-500 text-3xl">⟳</span></div>;
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors">Volver</Link>
          <div className="h-4 w-px bg-gray-300" />
          <h1 className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">{invitation.title}</h1>
        </div>
        <a 
          href={publicUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-medium text-rose-500 hover:text-rose-600 bg-rose-50 px-3 py-1.5 rounded-md"
        >
          Ver Pública
        </a>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-1">
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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${active ? 'bg-white text-rose-600 shadow-sm border border-gray-200/50' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
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
    try {
      await updateDoc(doc(db, 'invitations', invitation.id), {
        title: (form.title as unknown as HTMLInputElement).value,
        venue: form.venue.value,
        slug: form.slug.value,
        welcomeMessage: form.welcomeMessage.value
      });
      toast.success('Cambios guardados');
    } catch(e) {
      toast.error('Error al guardar');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Compartir Invitación
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
            <QRCode value={publicUrl} size={120} level="M" />
            <div className="text-center mt-2 text-xs text-gray-500 font-medium flex items-center justify-center gap-1">
              <QrIcon className="w-3 h-3"/> Escanea
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm text-gray-600 mb-2">Envía este enlace a tus invitados para que puedan ver los detalles, confirmar asistencia y participar.</p>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <input type="text" readOnly value={publicUrl} className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-600 focus:outline-none" />
              <button 
                onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success('Copiado'); }}
                className="bg-white border-l border-gray-200 px-4 font-medium text-sm text-rose-500 hover:bg-rose-50 transition-colors"
              >
                Copiar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Información Básica</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del Evento</label>
              <input type="text" name="title" defaultValue={invitation.title} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enlace Personalizado (Slug)</label>
              <div className="flex items-stretch relative">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">/i/</span>
                <input type="text" name="slug" defaultValue={invitation.slug} className="flex-1 px-4 py-2 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 z-10 outline-none transition-all" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lugar (Venue)</label>
            <input type="text" name="venue" defaultValue={invitation.venue} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all" />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de Bienvenida</label>
             <textarea name="welcomeMessage" defaultValue={invitation.welcomeMessage} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all resize-none"></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-black transition-colors">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RsvpsTab({ invitationId }: { invitationId: string }) {
  const [rsvps, setRsvps] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `invitations/${invitationId}/rsvp_responses`), (snapshot) => {
      setRsvps(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [invitationId]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Lista de Invitados</h2>
        <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-sm font-semibold">
          {rsvps.reduce((acc, r) => acc + (r.attending === 'yes' ? (r.guests || 1) : 0), 0)} confirmados
        </div>
      </div>
      {rsvps.length === 0 ? (
        <div className="p-12 text-center text-gray-500">Nadie ha confirmado asistencia aún.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Asiste</th>
                <th className="px-6 py-3">Total personas</th>
                <th className="px-6 py-3">Acompañantes</th>
                <th className="px-6 py-3">Mensaje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {rsvps.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${r.attending === 'yes' ? 'bg-green-100 text-green-700' : r.attending === 'no' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.attending === 'yes' ? 'Sí' : r.attending === 'no' ? 'No' : 'Tal vez'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{r.guests || 1}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{r.companionNames || '-'}</td>
                  <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{r.message || '-'}</td>
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
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, `invitations/${invitationId}/tables`), (snapshot) => {
      setTables(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">Acomodo de Mesas</h2>
        <form onSubmit={handleAddTable} className="flex gap-4 mb-8">
          <input type="text" placeholder="Nombre (Ej. Familia Pérez)" value={newTableName} onChange={(e) => setNewTableName(e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 outline-none" required />
          <input type="number" placeholder="Sillas" value={newTableCapacity} onChange={(e) => setNewTableCapacity(e.target.value)} className="w-24 px-4 py-2 rounded-lg border border-gray-300 outline-none" required />
          <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black">Agregar</button>
        </form>

        <div className="grid sm:grid-cols-2 gap-4">
          {tables.map(table => (
            <div key={table.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-900">{table.name}</h4>
                <p className="text-sm text-gray-500">Capacidad: {table.capacity} personas</p>
              </div>
            </div>
          ))}
          {tables.length === 0 && (
             <div className="col-span-full py-12 text-center text-gray-500">Aún no has agregado mesas.</div>
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

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Mesa de Regalos</h2>
        <form onSubmit={handleAddItem} className="flex gap-4 mb-8 flex-col sm:flex-row">
          <input type="text" placeholder="Nombre del regalo" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 outline-none" required />
          <input type="url" placeholder="Enlace (opcional)" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 outline-none" />
          <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black">Agregar</button>
        </form>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-xl">
              <div>
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                {item.url && <a href={item.url} target="_blank" className="text-sm text-rose-500 hover:underline">Ver en tienda</a>}
              </div>
              <div>
                <span className={`text-xs px-2 py-1 rounded-md font-semibold ${item.reserved ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                  {item.reserved ? 'Reservado' : 'Disponible'}
                </span>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="py-12 text-center text-gray-500">Tu mesa de regalos está vacía.</div>}
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

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Galería en Vivo</h2>
      </div>
      <p className="text-gray-600 mb-8 border-l-4 border-rose-500 pl-4 py-1">Tus invitados verán la opción de subir fotos en el enlace público de la invitación. Las fotos aparecerán aquí en tiempo real.</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
            <img src={photo.imageUrl} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="text-white text-xs font-medium">Por: {photo.uploadedBy}</span>
            </div>
          </div>
        ))}
        {photos.length === 0 && <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl">Nadie ha subido fotos aún.</div>}
      </div>
    </div>
  );
}
