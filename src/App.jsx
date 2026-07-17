import { useEffect, useState } from 'react';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileAgent = /android|blackberry|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 1024;

      if (isMobileAgent || isSmallScreen) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    fetch('/api/cameras')
      .then((res) => res.json())
      .then((data) => {
        setCameras(data);
        setLoading(false);
      })
      .catch((err) => console.error("Erro ao carregar câmeras:", err));
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-950 text-white p-6 text-center select-none">
        <span className="text-5xl mb-4">🖥️</span>
        <h1 className="text-xl font-bold mb-2">Dispositivo Não Suportado</h1>
        <p className="text-slate-400 max-w-sm text-sm">
          Este painel monitora 6 transmissões ao vivo simultâneas e exige alto processamento. Por favor, acesse usando um computador.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-red-600 border-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-lg font-medium animate-pulse">Buscando transmissões das pistas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] text-slate-100 p-6 flex flex-col justify-between">
      {/* Header Temático Chile */}
      <header className="mb-6 flex justify-between items-center bg-[#111a36] p-5 rounded-2xl border-l-4 border-red-600 shadow-xl border-y border-r border-slate-800">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-md flex items-center justify-center text-white font-bold text-xl">
            🇨🇱
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Painel de Neve <span className="text-red-500">—</span> Chile
            </h1>
            <p className="text-xs text-slate-400 font-medium">Centro de monitoramento ao vivo das estações de esqui</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.pathname = '/admin'} 
          className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-lg transition-all border border-blue-500 active:scale-95"
        >
          Gerenciar Feeds
        </button>
      </header>

      {/* Grid das Câmeras */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {cameras.map((cam) => (
          <div key={cam.id} className="bg-[#111a36] rounded-2xl overflow-hidden border border-slate-800 flex flex-col shadow-2xl group transition-all duration-300 hover:border-blue-500/50">
            <div className="relative pt-[56.25%] w-full bg-black">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${cam.embed_id}?autoplay=1&mute=1&modestbranding=1&rel=0`}
                title={cam.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-[#111a36] flex items-center justify-between border-t border-slate-800">
              <span className="font-bold text-sm text-slate-200 tracking-wide">{cam.title}</span>
              <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded-full border border-slate-800">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">AO VIVO</span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Footer simples */}
      <footer className="mt-6 text-center text-[11px] text-slate-500 font-medium">
        Painel de Controle de Câmeras • Desenvolvido com Cloudflare & Neon
      </footer>
    </div>
  );
}
