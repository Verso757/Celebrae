import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { CalendarHeart, Users, PartyPopper, CheckCircle, MapPin, Music, Heart, Sparkles } from 'lucide-react';

export default function Landing() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDF0F5] text-[#7C3A50] font-sans selection:bg-[#F5D5E2] selection:text-[#7C3A50]">
      {/* Navigation */}
      <header className="py-6 px-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <PartyPopper className="h-6 w-6 text-[#C4617E]" />
          <span className="font-serif font-semibold text-2xl tracking-wide">Celebrae</span>
        </div>
        <nav className="hidden md:flex gap-8 font-medium">
          <a href="#como-funciona" className="hover:text-[#C4617E] transition-colors">Cómo funciona</a>
          <a href="#features" className="hover:text-[#C4617E] transition-colors">Características</a>
          <a href="#precios" className="hover:text-[#C4617E] transition-colors">Planes</a>
        </nav>
        <div>
          {currentUser ? (
            <Link to="/dashboard" className="px-6 py-2.5 bg-[#C4617E] text-white font-bold rounded-full hover:bg-[#a94f68] transition-colors">
              Ir a mi panel
            </Link>
          ) : (
            <div className="flex gap-4 items-center">
              <Link to="/login" className="hidden sm:inline hover:text-[#C4617E] font-medium transition-colors">
                Iniciar sesión
              </Link>
              <Link to="/login" className="px-6 py-2.5 bg-[#C4617E] text-white font-bold rounded-full shadow-none hover:bg-[#a94f68] transition-colors">
                Crear gratis
              </Link>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto px-8 py-16 lg:py-24">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4">
              La invitación perfecta para tu <span className="italic text-[#C4617E]">día especial</span>
            </h1>
            <p className="text-lg sm:text-xl font-light mb-10 max-w-xl mx-auto lg:mx-0 opacity-90 leading-relaxed">
              Crea impresionantes invitaciones digitales en minutos. Gestiona confirmaciones, organiza tus mesas y comparte la magia con tus invitados sin complicaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={currentUser ? '/dashboard' : '/login'} className="px-8 py-4 bg-[#C4617E] text-white font-bold rounded-full hover:bg-[#a94f68] transition-all text-lg flex items-center justify-center gap-2">
                Empieza ahora <Sparkles className="w-5 h-5" />
              </Link>
              <a href="#como-funciona" className="px-8 py-4 bg-[#F5D5E2] text-[#7C3A50] font-bold rounded-full hover:bg-[#E8A0B8] transition-all text-lg flex items-center justify-center">
                Ver demo
              </a>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center relative">
            <div className="absolute inset-0 bg-[#F5E6C8] rounded-full blur-3xl opacity-50 -z-10 transform translate-y-10"></div>
            {/* Mockup Card */}
            <div className="bg-white p-6 rounded-2xl border-[0.5px] border-[#F5D5E2] w-full max-w-sm rotate-3 transform transition-transform hover:rotate-0 duration-500">
               <div className="aspect-[3/4] bg-[#FDF0F5] rounded-xl mb-6 overflow-hidden flex items-center justify-center relative">
                 <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" alt="Boda" className="w-full h-full object-cover opacity-80" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[rgba(124,58,80,0.8)] to-transparent flex flex-col justify-end p-6 text-white text-center">
                    <h3 className="font-serif text-3xl font-bold mb-2">Ana & Carlos</h3>
                    <p className="font-light tracking-widest uppercase text-sm">20 Diciembre 2026</p>
                 </div>
               </div>
               <div className="flex gap-2">
                 <button className="flex-1 py-3 bg-[#C4617E] text-white rounded-full font-bold text-sm">Confirmar</button>
                 <button className="flex-1 py-3 bg-[#F5D5E2] text-[#7C3A50] rounded-full font-bold text-sm">Ver Detalles</button>
               </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="py-24 px-8 bg-white border-y border-[#F5D5E2]">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold mb-4">La magia en <span className="italic text-[#C4617E]">3 simples pasos</span></h2>
            <p className="text-lg opacity-80 mb-16 max-w-2xl mx-auto font-light">Diseñar la experiencia de tus invitados nunca fue tan elegante ni tan sencillo.</p>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#F5D5E2] text-[#C4617E] rounded-full flex items-center justify-center font-bold text-2xl mb-6 font-serif">1</div>
                <h3 className="text-xl font-bold mb-3">Crea tu evento</h3>
                <p className="font-light opacity-80 text-center">Añade los detalles principales, lugar, fecha y un mensaje de bienvenida personalizado.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#F5D5E2] text-[#C4617E] rounded-full flex items-center justify-center font-bold text-2xl mb-6 font-serif">2</div>
                <h3 className="text-xl font-bold mb-3">Diseña y Personaliza</h3>
                <p className="font-light opacity-80 text-center">Integra tu mesa de regalos, música de fondo y fotos para darle un toque único.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#F5D5E2] text-[#C4617E] rounded-full flex items-center justify-center font-bold text-2xl mb-6 font-serif">3</div>
                <h3 className="text-xl font-bold mb-3">Comparte y Recibe</h3>
                <p className="font-light opacity-80 text-center">Envía tu enlace personalizado y observa cómo se llenan tus mesas y galería de fotos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="font-serif text-4xl font-bold mb-4">Todo lo que necesitas, <span className="italic text-[#C4617E]">con clase</span></h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#F5E6C8] p-10 rounded-2xl border-[0.5px] border-[#F5D5E2] flex flex-col justify-center">
              <CheckCircle className="w-10 h-10 text-[#C4617E] mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-serif">Gestión RSVP Inteligente</h3>
              <p className="font-light opacity-90 leading-relaxed">Olvídate de perseguir invitados. Recibe confirmaciones al instante, con número de acompañantes y notas sobre restricciones alimenticias directamente en tu panel.</p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl border-[0.5px] border-[#F5D5E2] flex flex-col justify-center">
              <Users className="w-10 h-10 text-[#C4617E] mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-serif">Organización de Mesas</h3>
              <p className="font-light opacity-90 leading-relaxed">No más dolores de cabeza con post-its. Agrupa a tus invitados en mesas, define capacidades y asegúrate de que todos estén cómodos.</p>
            </div>

            <div className="bg-white p-10 rounded-2xl border-[0.5px] border-[#F5D5E2] flex flex-col justify-center">
              <MapPin className="w-10 h-10 text-[#C4617E] mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-serif">Ubicación y Detalles</h3>
              <p className="font-light opacity-90 leading-relaxed">Tus invitados siempre sabrán dónde es la fiesta. Muestra la dirección exacta y un enlace directo a mapas.</p>
            </div>

            <div className="bg-[#C4617E] text-white p-10 rounded-2xl flex flex-col justify-center">
              <Heart className="w-10 h-10 text-[#FDF0F5] mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-serif">Mesa de Regalos & Galería</h3>
              <p className="font-light opacity-90 leading-relaxed">Una boda moderna requiere soluciones modernas. Enlaza tus mesas de regalo y permite que tus invitados suban las fotos del evento a una galería compartida.</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="precios" className="py-24 px-8 bg-white border-y border-[#F5D5E2]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold mb-4">Planes diseñados para <span className="italic text-[#C4617E]">tu celebración</span></h2>
              <p className="text-lg opacity-80 font-light">Comienza gratis, mejora cuando estés listo.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Free Plan */}
              <div className="p-8 rounded-2xl border-[0.5px] border-[#F5D5E2] bg-[#FDF0F5]">
                <h3 className="text-xl font-bold mb-2">Esencial</h3>
                <div className="text-4xl font-bold font-serif mb-6">$0<span className="text-lg font-sans font-normal opacity-70 text-[#7C3A50]">/gratis</span></div>
                <ul className="space-y-4 mb-8 font-light">
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-[#C4617E]" /> 1 Evento</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-[#C4617E]" /> RSVP Ilimitado</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-[#C4617E]" /> Diseño Estándar</li>
                </ul>
                <Link to="/login" className="block text-center w-full py-3 bg-white text-[#7C3A50] border border-[#F5D5E2] rounded-full font-bold hover:bg-[#F5D5E2] transition-colors">
                  Comenzar
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="p-10 rounded-2xl border-[0.5px] border-[#C9A96E] bg-white relative transform md:-translate-y-4 shadow-xl shadow-[#F5D5E2]/50">
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3">
                   <div className="bg-[#C9A96E] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Favorito</div>
                </div>
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold font-serif mb-6">$99<span className="text-lg font-sans font-normal opacity-70 text-[#7C3A50]">/evento</span></div>
                <ul className="space-y-4 mb-8 font-light">
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-[#C4617E]" /> Todo lo de Esencial</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-[#C4617E]" /> Mesa de Regalos</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-[#C4617E]" /> Galería de Fotos Colaborativa</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-[#C4617E]" /> Acomodo de Mesas</li>
                </ul>
                <Link to="/login" className="block text-center w-full py-3 bg-[#C4617E] text-white rounded-full font-bold hover:bg-[#a94f68] transition-colors">
                  Obtener Premium
                </Link>
              </div>

              {/* Agency Plan */}
              <div className="p-8 rounded-2xl border-[0.5px] border-[#F5D5E2] bg-[#FDF0F5]">
                <h3 className="text-xl font-bold mb-2">Wedding Planner</h3>
                <div className="text-4xl font-bold font-serif mb-6">$299<span className="text-lg font-sans font-normal opacity-70 text-[#7C3A50]">/mes</span></div>
                <ul className="space-y-4 mb-8 font-light">
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-[#C4617E]" /> Eventos Ilimitados</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-[#C4617E]" /> Soporte Prioritario</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-[#C4617E]" /> Marca Blanca (Próximamente)</li>
                </ul>
                <Link to="/login" className="block text-center w-full py-3 bg-white text-[#7C3A50] border border-[#F5D5E2] rounded-full font-bold hover:bg-[#F5D5E2] transition-colors">
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#7C3A50] text-[#FDF0F5] py-16 px-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <PartyPopper className="h-6 w-6 text-[#F5D5E2]" />
          <span className="font-serif font-bold text-2xl">Celebrae</span>
        </div>
        <p className="font-light opacity-80 mb-8 max-w-md mx-auto">Elevando el estándar de las invitaciones digitales para eventos extraordinarios.</p>
        <div className="h-px w-24 bg-[#E8A0B8] mx-auto opacity-30 mb-8"></div>
        <p className="text-sm font-light opacity-60">© 2026 Celebrae. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
