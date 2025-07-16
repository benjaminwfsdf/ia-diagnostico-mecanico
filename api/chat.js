// chat.js en /api

// 👇 Importa 'fetch' si estás en Node.js (como en Vercel)
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sólo POST permitido' });
  }

  const API_KEY = process.env.OPENAI_API_KEY;
  const mensajeUsuario = req.body.mensaje;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: mensajeUsuario }],
        temperature: 0.6
      })
    });

    const data = await openaiRes.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json({ respuesta: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Error al contactar a OpenAI" });
  }
}
