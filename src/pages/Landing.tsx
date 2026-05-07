import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { CalendarHeart, Users, PartyPopper, CheckCircle, MapPin, Music, Heart, Sparkles } from 'lucide-react';

export default function Landing() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark font-sans selection:bg-brand-soft selection:text-brand-dark">
      {/* Navigation */}
      <header className="py-6 px-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <PartyPopper className="h-6 w-6 text-brand-main" />
          <span className="font-serif font-semibold text-2xl tracking-wide">Celebrae</span>
        </div>
        <nav className="hidden md:flex gap-8 font-medium">
          <a href="#como-funciona" className="hover:text-brand-main transition-colors">Cómo funciona</a>
          <a href="#features" className="hover:text-brand-main transition-colors">Características</a>
          <a href="#precios" className="hover:text-brand-main transition-colors">Planes</a>
        </nav>
        <div>
          {currentUser ? (
            <Link to="/dashboard" className="px-6 py-2.5 bg-brand-main text-white font-bold rounded-full hover:bg-[#a94f68] transition-colors">
              Ir a mi panel
            </Link>
          ) : (
            <div className="flex gap-4 items-center">
              <Link to="/login" className="hidden sm:inline hover:text-brand-main font-medium transition-colors">
                Iniciar sesión
              </Link>
              <Link to="/login" className="px-6 py-2.5 bg-brand-main text-white font-bold rounded-full shadow-none hover:bg-[#a94f68] transition-colors">
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
              La invitación perfecta para tu <span className="italic text-brand-main">día especial</span>
            </h1>
            <p className="text-lg sm:text-xl font-light mb-10 max-w-xl mx-auto lg:mx-0 opacity-90 leading-relaxed">
              Crea impresionantes invitaciones digitales en minutos. Gestiona confirmaciones, organiza tus mesas y comparte la magia con tus invitados sin complicaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={currentUser ? '/dashboard' : '/login'} className="px-8 py-4 bg-brand-main text-white font-bold rounded-full hover:bg-[#a94f68] transition-all text-lg flex items-center justify-center gap-2">
                Empieza ahora <Sparkles className="w-5 h-5" />
              </Link>
              <Link to="/demo" className="px-8 py-4 bg-brand-soft text-brand-dark font-bold rounded-full hover:bg-brand-medium transition-all text-lg flex items-center justify-center">
                Ver demo
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center relative">
            <div className="absolute inset-0 bg-brand-champagne rounded-full blur-3xl opacity-50 -z-10 transform translate-y-10"></div>
            {/* Mockup Card */}
            <div className="bg-white p-6 rounded-2xl border-[0.5px] border-brand-soft w-full max-w-sm rotate-3 transform transition-transform hover:rotate-0 duration-500">
               <div className="aspect-[3/4] bg-brand-bg rounded-xl mb-6 overflow-hidden flex items-center justify-center relative">
                 <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" alt="Boda" className="w-full h-full object-cover opacity-80" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[rgba(124,58,80,0.8)] to-transparent flex flex-col justify-end p-6 text-white text-center">
                    <h3 className="font-serif text-3xl font-bold mb-2">Ana & Carlos</h3>
                    <p className="font-light tracking-widest uppercase text-sm">20 Diciembre 2026</p>
                 </div>
               </div>
               <div className="flex gap-2">
                 <Link to="/demo" className="flex-1 py-3 text-center bg-brand-main text-white rounded-full font-bold text-sm hover:bg-[#a94f68] transition-colors">Confirmar</Link>
                 <Link to="/demo" className="flex-1 py-3 text-center bg-brand-soft text-brand-dark rounded-full font-bold text-sm hover:bg-brand-medium transition-colors">Ver Detalles</Link>
               </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="py-24 px-8 bg-white border-y border-brand-soft">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold mb-4">La magia en <span className="italic text-brand-main">3 simples pasos</span></h2>
            <p className="text-lg opacity-80 mb-16 max-w-2xl mx-auto font-light">Diseñar la experiencia de tus invitados nunca fue tan elegante ni tan sencillo.</p>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-brand-soft text-brand-main rounded-full flex items-center justify-center font-bold text-2xl mb-6 font-serif">1</div>
                <h3 className="text-xl font-bold mb-3">Crea tu evento</h3>
                <p className="font-light opacity-80 text-center">Añade los detalles principales, lugar, fecha y un mensaje de bienvenida personalizado.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-brand-soft text-brand-main rounded-full flex items-center justify-center font-bold text-2xl mb-6 font-serif">2</div>
                <h3 className="text-xl font-bold mb-3">Diseña y Personaliza</h3>
                <p className="font-light opacity-80 text-center">Integra tu mesa de regalos, música de fondo y fotos para darle un toque único.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-brand-soft text-brand-main rounded-full flex items-center justify-center font-bold text-2xl mb-6 font-serif">3</div>
                <h3 className="text-xl font-bold mb-3">Comparte y Recibe</h3>
                <p className="font-light opacity-80 text-center">Envía tu enlace personalizado y observa cómo se llenan tus mesas y galería de fotos.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="font-serif text-4xl font-bold mb-4">Todo lo que necesitas, <span className="italic text-brand-main">con clase</span></h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-brand-champagne p-10 rounded-2xl border-[0.5px] border-brand-soft flex flex-col justify-center">
              <CheckCircle className="w-10 h-10 text-brand-main mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-serif">Gestión RSVP Inteligente</h3>
              <p className="font-light opacity-90 leading-relaxed">Olvídate de perseguir invitados. Recibe confirmaciones al instante, con número de acompañantes y notas sobre restricciones alimenticias directamente en tu panel.</p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl border-[0.5px] border-brand-soft flex flex-col justify-center">
              <Users className="w-10 h-10 text-brand-main mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-serif">Organización de Mesas</h3>
              <p className="font-light opacity-90 leading-relaxed">No más dolores de cabeza con post-its. Agrupa a tus invitados en mesas, define capacidades y asegúrate de que todos estén cómodos.</p>
            </div>

            <div className="bg-white p-10 rounded-2xl border-[0.5px] border-brand-soft flex flex-col justify-center">
              <MapPin className="w-10 h-10 text-brand-main mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-serif">Ubicación y Detalles</h3>
              <p className="font-light opacity-90 leading-relaxed">Tus invitados siempre sabrán dónde es la fiesta. Muestra la dirección exacta y un enlace directo a mapas.</p>
            </div>

            <div className="bg-brand-main text-white p-10 rounded-2xl flex flex-col justify-center">
              <Heart className="w-10 h-10 text-brand-bg mb-6" />
              <h3 className="text-2xl font-bold mb-3 font-serif">Mesa de Regalos & Galería</h3>
              <p className="font-light opacity-90 leading-relaxed">Una boda moderna requiere soluciones modernas. Enlaza tus mesas de regalo y permite que tus invitados suban las fotos del evento a una galería compartida.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonios" className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="font-serif text-4xl font-bold mb-4">Lo que dicen <span className="italic text-brand-main">nuestros novios</span></h2>
             <p className="text-lg opacity-80 font-light max-w-2xl mx-auto">Cientos de parejas ya han confiado en Celebrae para el día más importante de sus vidas.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[14px] border-[0.5px] border-brand-soft">
              <div className="flex text-brand-gold mb-4">
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <p className="font-light italic opacity-90 mb-6 flex-1">"Fue tan fácil crear nuestra invitación. A los invitados les encantó poder confirmar y subir sus fotos desde el mismo lugar. ¡Una experiencia perfecta!"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 bg-brand-soft rounded-full flex items-center justify-center text-brand-dark font-bold font-serif text-lg">MV</div>
                <div>
                  <h4 className="font-bold text-sm">María & Víctor</h4>
                  <p className="text-xs opacity-70">Boda en Valle de Guadalupe</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[14px] border-[0.5px] border-brand-soft">
              <div className="flex text-brand-gold mb-4">
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <p className="font-light italic opacity-90 mb-6 flex-1">"La organización de mesas nos salvó la vida. Poder ver quién había confirmado e ir acomodándolos directamente en la plataforma nos ahorró muchísimo tiempo y estrés."</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 bg-brand-champagne rounded-full flex items-center justify-center text-brand-dark font-bold font-serif text-lg">SJ</div>
                <div>
                  <h4 className="font-bold text-sm">Sofía & Juan</h4>
                  <p className="text-xs opacity-70">Boda en CDMX</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[14px] border-[0.5px] border-brand-soft">
              <div className="flex text-brand-gold mb-4">
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <p className="font-light italic opacity-90 mb-6 flex-1">"Nuestros invitados quedaron impresionados con el diseño de la invitación. Se veía súper profesional y moderna, justo lo que estábamos buscando para nuestro evento."</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 bg-brand-bg rounded-full flex items-center justify-center text-brand-main font-bold font-serif text-lg">AD</div>
                <div>
                  <h4 className="font-bold text-sm">Andrea & Diego</h4>
                  <p className="text-xs opacity-70">Boda de Destino</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="precios" className="py-24 px-8 bg-white border-y border-brand-soft">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold mb-4">Planes diseñados para <span className="italic text-brand-main">tu celebración</span></h2>
              <p className="text-lg opacity-80 font-light">Comienza gratis, mejora cuando estés listo.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* Free Plan */}
              <div className="p-8 rounded-2xl border-[0.5px] border-brand-soft bg-brand-bg">
                <h3 className="text-xl font-bold mb-2">Esencial</h3>
                <div className="text-4xl font-bold font-serif mb-6">$0<span className="text-lg font-sans font-normal opacity-70 text-brand-dark">/gratis</span></div>
                <ul className="space-y-4 mb-8 font-light">
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-brand-main" /> 1 Evento</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-brand-main" /> RSVP Ilimitado</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-brand-main" /> Diseño Estándar</li>
                </ul>
                <Link to="/login" className="block text-center w-full py-3 bg-white text-brand-dark border border-brand-soft rounded-full font-bold hover:bg-brand-soft transition-colors">
                  Comenzar
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="p-10 rounded-2xl border-[0.5px] border-brand-gold bg-white relative transform md:-translate-y-4 shadow-xl shadow-brand-soft/50">
                <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3">
                   <div className="bg-brand-gold text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Favorito</div>
                </div>
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold font-serif mb-6">$99<span className="text-lg font-sans font-normal opacity-70 text-brand-dark">/evento</span></div>
                <ul className="space-y-4 mb-8 font-light">
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-brand-main" /> Todo lo de Esencial</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-brand-main" /> Mesa de Regalos</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-brand-main" /> Galería de Fotos Colaborativa</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-brand-main" /> Acomodo de Mesas</li>
                </ul>
                <Link to="/login" className="block text-center w-full py-3 bg-brand-main text-white rounded-full font-bold hover:bg-[#a94f68] transition-colors">
                  Obtener Premium
                </Link>
              </div>

              {/* Agency Plan */}
              <div className="p-8 rounded-2xl border-[0.5px] border-brand-soft bg-brand-bg">
                <h3 className="text-xl font-bold mb-2">Wedding Planner</h3>
                <div className="text-4xl font-bold font-serif mb-6">$299<span className="text-lg font-sans font-normal opacity-70 text-brand-dark">/mes</span></div>
                <ul className="space-y-4 mb-8 font-light">
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-brand-main" /> Eventos Ilimitados</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-brand-main" /> Soporte Prioritario</li>
                  <li className="flex gap-3 items-center"><CheckCircle className="w-5 h-5 text-brand-main" /> Marca Blanca (Próximamente)</li>
                </ul>
                <Link to="/login" className="block text-center w-full py-3 bg-white text-brand-dark border border-brand-soft rounded-full font-bold hover:bg-brand-soft transition-colors">
                  Contactar
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-dark text-brand-bg py-16 px-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <PartyPopper className="h-6 w-6 text-brand-soft" />
          <span className="font-serif font-bold text-2xl">Celebrae</span>
        </div>
        <p className="font-light opacity-80 mb-8 max-w-md mx-auto">Elevando el estándar de las invitaciones digitales para eventos extraordinarios.</p>
        <div className="h-px w-24 bg-brand-medium mx-auto opacity-30 mb-8"></div>
        <p className="text-sm font-light opacity-60">© 2026 Celebrae. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
