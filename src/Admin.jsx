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
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
        <p className="text-lg animate-pulse">Carregando painel admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 p-6">
      <header className="mb-6 flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">⚙️ Painel de Administração</h1>
          <p className="text-xs text-slate-400">Troque os IDs das lives do YouTube rapidamente caso caiam</p>
        </div>
        <button onClick={() => window.location.pathname = '/'} className="text-xs bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium transition">
          Voltar ao Monitor
        </button>
      </header>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-blue-900/50 border border-blue-700 text-sm text-blue-200">
          {message}
        </div>
      )}

      <main className="space-y-4">
        {cameras.map((cam) => (
          <div key={cam.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Título da Estação/Câmera</label>
              <input
                type="text"
                value={cam.title}
                onChange={(e) => handleInputChange(cam.id, 'title', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">ID do Vídeo no YouTube (Ex: dQw4w9WgXcQ)</label>
              <input
                type="text"
                value={cam.embed_id}
                onChange={(e) => handleInputChange(cam.id, 'embed_id', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs text-slate-500 italic">Posição do Grid: #{cam.display_order}</span>
              <button
                onClick={() => handleSave(cam.id)}
                disabled={savingId === cam.id}
                className="bg-slate-700 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {savingId === cam.id ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
