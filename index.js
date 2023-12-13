const express = require('express');
const axios = require('axios');

const clientId = '39673c85-309e-431c-b81d-25476d8797f8';
const tenantId = 'add67cd2-c8b2-416c-b171-b61b22be92f4';
const clientSecret = 'Ank8Q~Y15OoCrKBVONL6m6t4FnICBWlIxnpFtcCo';
const scope = 'api://6e0063e1-5b74-4730-99c6-2b1541144e5c/.default'; // Access scope of WebApp2 API

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World! sender...');
});

app.get('/generate-token', async (req, res) => {
  try {
    const body = {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope,
    };

    const response = await axios.post('https://login.microsoftonline.com/add67cd2-c8b2-416c-b171-b61b22be92f4/oauth2/v2.0/token', body);

    const token = response.data.access_token;
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating token' });
  }
});

app.get('/api-call', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const response = await axios.get('https://YOUR_WEBAPP2_API_URL', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error calling API' });
  }
});

app.listen(3000, () => console.log('WebApp1 listening on port 3000'));
