const express = require('express');
const axios = require('axios');  // Use 'axios' directly

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World! sender...!!!!!!');
});


// Azure AD configuration for sender
const azureAdConfig = {
    tenantId: 'add67cd2-c8b2-416c-b171-b61b22be92f4',
    clientId: '39673c85-309e-431c-b81d-25476d8797f8',
    clientSecret: 'Ank8Q~Y15OoCrKBVONL6m6t4FnICBWlIxnpFtcCo',
   // receiverApiUrl: 'api://6e0063e1-5b74-4730-99c6-2b1541144e5c'
    //receiverApiUrl: 'https://add67cd2-c8b2-416c-b171-b61b22be92f4.onmicrosoft.com/api://6e0063e1-5b74-4730-99c6-2b1541144e5c',
};

// Request an access token from Azure AD
async function getAccessToken() {
    try {
        const response = await axios.post(`https://login.microsoftonline.com/${azureAdConfig.tenantId}/oauth2/v2.0/token`, {
            grant_type: 'client_credentials',
            client_id: azureAdConfig.clientId,
            client_secret: azureAdConfig.clientSecret,
            // scope: azureAdConfig.receiverApiUrl + '/.default',
            scope: 'api://6e0063e1-5b74-4730-99c6-2b1541144e5c/.default',

        });
        const accessToken = response.data.access_token;
        console.log('Access Token:', accessToken);

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.message);
        throw error;
    }
}

// Handle requests to send data
app.get('/send-data', async (req, res) => {
    try {
        const accessToken = await getAccessToken();

        // Make a request to the receiver with the obtained access token
        const response = await axios.get(azureAdConfig.receiverApiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error sending data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the sender app
app.listen(port, () => {
    console.log(`Sender app listening at http://localhost:${port}`);
});
