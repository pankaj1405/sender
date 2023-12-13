const express = require('express');
const axios = require('axios');

// Replace with your Azure AD application details
const clientId = '39673c85-309e-431c-b81d-25476d8797f8';
const clientSecret = 'Ank8Q~Y15OoCrKBVONL6m6t4FnICBWlIxnpFtcCo';
const tenantId = 'add67cd2-c8b2-416c-b171-b61b22be92f4';
const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

const app = express();

app.get('/', async (req, res) => {
  try {
    // Get access token
    const tokenResponse = await axios.post(tokenEndpoint, {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    });
    const accessToken = tokenResponse.data.access_token;

    // Send request to your receiver with the access token
    const receiverUrl = 'receivers2s.azurewebsites.netL';
    const response = await axios.post(receiverUrl, { message: 'Hello from Sender!' }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    res.send(`Sent message to receiver: ${response.data}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending message');
  }
});

app.listen(3000, () => console.log('Sender listening on port 3000'));
