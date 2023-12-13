const express = require('express');
const axios = require('axios');

const clientId = '39673c85-309e-431c-b81d-25476d8797f8' ;
const tenantId = 'add67cd2-c8b2-416c-b171-b61b22be92f4' ;
const clientSecret = 'Ank8Q~Y15OoCrKBVONL6m6t4FnICBWlIxnpFtcCo' ;
const scope = 'api://6e0063e1-5b74-4730-99c6-2b1541144e5c/.default' ;
const receiverUrl = 'https://receivers2s.azurewebsites.net' ;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World...!!! sender...!!!');
});


app.get('/send-data', async (req, res) => {
  // Generate token
  const tokenResponse = await axios.post(
    'https://login.microsoftonline.com/add67cd2-c8b2-416c-b171-b61b22be92f4/oauth2/v2.0/token',
    {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: scope,
    }
  );

  const token = tokenResponse.data.access_token;

  // Call receiver API with token
  const apiResponse = await axios.get(`${receiverUrl}/api`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  res.send(apiResponse.data);
});

app.listen(process.env.PORT || 3000, () => console.log('Sender listening on port 3000'));

// Add error handling and other logic as needed
