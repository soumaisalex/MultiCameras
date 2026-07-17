import { useEffect, useState } from 'react';

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Validação de Dispositivo
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileAgent = /android|blackberry|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 1024; // Bloqueia abaixo de 1024px

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

  // 2. Busca os dados do Neon via Cloudflare Function
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

  // Tela de Bloqueio para Mobile
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-950 text-white p-6 text-center select-none">
        <span className="text-5xl mb-4">🖥️</span>
        <h1 className="text-xl font-bold mb-2">Dispositivo Não Suportado</h1>
        <p className="text-slate-400 max-w-sm text-sm balance">
          Este painel monitora 6 transmissões ao vivo simultâneas e exige alto processamento. Por favor, acesse usando um computador.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
        <p className="text-lg animate-pulse">Carregando painel de neve...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 p-4 flex flex-col justify-between">
      {/* Header simples */}
      <header className="mb-4 flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            ❄️ Painel de Neve — Chile
          </h1>
          <p className="text-xs text-slate-400">Monitoramento ao vivo de estações de esqui</p>
        </div>
        <a href="/admin" className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition">
          Painel Admin
        </a>
      </header>

      {/* Grid com as 6 câmeras */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {cameras.map((cam) => (
          <div key={cam.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col shadow-lg">
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
            <div className="p-3 bg-slate-800/90 flex items-center justify-between">
              <span className="font-medium text-sm truncate">{cam.title}</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
