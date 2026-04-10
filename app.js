// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const accessToken = process.env.WHATSAPP_TOKEN; // Esta es la nueva línea

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/webhook', async (req, res) => {
    const body = req.body;

    // Verificar que el evento venga de WhatsApp
    if (body.object === 'whatsapp_business_account') {
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            
            const message = body.entry[0].changes[0].value.messages[0];
            const from = message.from; // Número del cliente que escribe
            const msgBody = message.text ? message.text.body : ""; // Texto que envió

            console.log(`\n--- Nuevo Mensaje ---`);
            console.log(`De: ${from}`);
            console.log(`Mensaje: ${msgBody}`);
            console.log(`---------------------\n`);

            // Aquí es donde luego pondremos la respuesta automática
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
