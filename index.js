const express = require('express');
const axios = require('axios');

const app = express();

const tenantId: 'add67cd2-c8b2-416c-b171-b61b22be92f4';
const clientId: '39673c85-309e-431c-b81d-25476d8797f8';
const clientSecret: 'Ank8Q~Y15OoCrKBVONL6m6t4FnICBWlIxnpFtcCo';
const scope =  'api://6e0063e1-5b74-4730-99c6-2b1541144e5c/.default';
const tokenUrl = 'https://login.microsoftonline.com/add67cd2-c8b2-416c-b171-b61b22be92f4/oauth2/v2.0/token'; 

app.get('/', (req, res) => {
  res.send('Hello, World..! sender...!!!!!!');
});


app.post('/generate-token', async (req, res) => {
  try {
    const response = await axios.post(tokenUrl, {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope,
      tenant_id: tenantId,
    });

    const token = response.data.access_token;
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error generating token' });
  }
});

app.listen(3000, () => console.log('Server listening on port 3000'));
