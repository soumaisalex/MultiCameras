import { useEffect, useState } from 'react';

export default function Admin() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/cameras')
      .then((res) => res.json())
      .then((data) => {
        setCameras(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar câmeras:', err);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (id, field, value) => {
    setCameras((prev) =>
      prev.map((cam) => (cam.id === id ? { ...cam, [field]: value } : cam))
    );
  };

  const handleSave = async (id) => {
    const cameraToSave = cameras.find((cam) => cam.id === id);
    setSavingId(id);
    setMessage('');

    try {
      const res = await fetch('/api/cameras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cameraToSave.id,
          title: cameraToSave.title,
          embed_id: cameraToSave.embed_id,
        }),
      });

      if (res.ok) {
        setMessage(`Câmera "${cameraToSave.title}" atualizada com sucesso!`);
      } else {
        setMessage('Erro ao salvar no banco.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Erro ao conectar à API.');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg animate-pulse font-medium">Carregando painel administrativo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] text-slate-100 p-6">
      <header className="mb-6 flex justify-between items-center bg-[#111a36] p-5 rounded-2xl border-l-4 border-blue-600 shadow-xl border-y border-r border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">⚙️ Configurações de Monitoramento</h1>
          <p className="text-xs text-slate-400 font-medium">Substitua os IDs do YouTube caso alguma transmissão saia do ar</p>
        </div>
        <button 
          onClick={() => window.location.pathname = '/'} 
          className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl shadow-lg transition-all border border-red-500 active:scale-95"
        >
          Voltar ao Monitor
        </button>
      </header>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-blue-950/80 border border-blue-800 text-sm font-semibold text-blue-200 shadow-md">
          {message}
        </div>
      )}

      <main className="space-y-4">
        {cameras.map((cam) => (
          <div key={cam.id} className="bg-[#111a36] p-5 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-5 items-end shadow-md">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Nome da Estação de Esqui</label>
              <input
                type="text"
                value={cam.title}
                onChange={(e) => handleInputChange(cam.id, 'title', e.target.value)}
                className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">ID do Vídeo no YouTube</label>
              <input
                type="text"
                value={cam.embed_id}
                onChange={(e) => handleInputChange(cam.id, 'embed_id', e.target.value)}
                className="w-full bg-[#0a0f1d] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Posição #{cam.display_order}</span>
              <button
                onClick={() => handleSave(cam.id)}
                disabled={savingId === cam.id}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 active:scale-95 shadow-md"
              >
                {savingId === cam.id ? 'Salvando...' : 'Atualizar Feed'}
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
