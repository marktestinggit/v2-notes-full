const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userNote = req.body.content;
  const GROK_API_KEY = process.env.GROK_API_KEY;
  const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

  const messages = [
    {
      role: "user",
      content: `Please structure the following clinical note in SOAP format and provide a diagnosis and plan.\n\n${userNote}`
    }
  ];

  try {
    const response = await axios.post(
      GROK_API_URL,
      {
        model: "grok-3",
        messages: messages
      },
      {
        headers: {
          Authorization: `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = response.data.choices[0].message.content;
    res.status(200).json({ output: result });
  } catch (err) {
    console.error("Grok API error:", err.response?.data || err.message);
    res.status(500).json({ error: 'AI analysis failed.' });
  }
};
