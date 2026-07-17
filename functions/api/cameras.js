import { neon } from '@neondatabase/serverless';

export async function onRequest(context) {
  // Puxa a string de conexão das variáveis de ambiente do Cloudflare Pages
  const sql = neon(context.env.DATABASE_URL);

  // Trata requisição GET (Listar Câmeras)
  if (context.request.method === 'GET') {
    try {
      const data = await sql`SELECT * FROM cameras ORDER BY display_order ASC LIMIT 6`;
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  // Trata requisição POST (Atualizar Câmera no Admin)
  if (context.request.method === 'POST') {
    try {
      const { id, title, embed_id } = await context.request.json();
      
      await sql`
        UPDATE cameras 
        SET title = ${title}, embed_id = ${embed_id}, updated_at = NOW() 
        WHERE id = ${id}
      `;

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  return new Response('Método não permitido', { status: 405 });
}
