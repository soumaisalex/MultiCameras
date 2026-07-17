import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  const sql = neon(context.env.DATABASE_URL);
  const { method } = context.request;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }

  // GET: Retorna as 6 câmeras
  if (method === 'GET') {
    try {
      const data = await sql`SELECT * FROM cameras ORDER BY display_order ASC LIMIT 6`;
      return new Response(JSON.stringify(data), { headers, status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { headers, status: 500 });
    }
  }

  // POST: Atualiza os dados enviados pelo painel administrativo
  if (method === 'POST') {
    try {
      const { id, title, embed_id } = await context.request.json();
      
      if (!id || !title || !embed_id) {
        return new Response(JSON.stringify({ error: 'Dados incompletos' }), { headers, status: 400 });
      }

      await sql`
        UPDATE cameras 
        SET title = ${title}, embed_id = ${embed_id}, updated_at = NOW() 
        WHERE id = ${id}
      `;

      return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { headers, status: 500 });
    }
  }

  return new Response('Método não permitido', { headers, status: 405 });
}
