const express = require('express');
const axios = require('axios');  // Use 'axios' directly

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World! sender...');
});


// Azure AD configuration for sender
const azureAdConfig = {
    tenantId: 'add67cd2-c8b2-416c-b171-b61b22be92f4',
    clientId: '39673c85-309e-431c-b81d-25476d8797f8',
    clientSecret: 'Ank8Q~Y15OoCrKBVONL6m6t4FnICBWlIxnpFtcCo',
   // receiverApiUrl: 'api://6e0063e1-5b74-4730-99c6-2b1541144e5c'
    //receiverApiUrl: 'https://add67cd2-c8b2-416c-b171-b61b22be92f4.onmicrosoft.com/api://6e0063e1-5b74-4730-99c6-2b1541144e5c',
};



curl -X GET https://receivers2s.azurewebsites.net/  --header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiJhcGk6Ly82ZTAwNjNlMS01Yjc0LTQ3MzAtOTljNi0yYjE1NDExNDRlNWMiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9hZGQ2N2NkMi1jOGIyLTQxNmMtYjE3MS1iNjFiMjJiZTkyZjQvIiwiaWF0IjoxNzAyNDU4Nzc0LCJuYmYiOjE3MDI0NTg3NzQsImV4cCI6MTcwMjQ2MjY3NCwiYWlvIjoiRTJWZ1lNaFduaGY5NExFM3IwS1h5OGZYR2EvdUF3QT0iLCJhcHBpZCI6IjM5NjczYzg1LTMwOWUtNDMxYy1iODFkLTI1NDc2ZDg3OTdmOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2FkZDY3Y2QyLWM4YjItNDE2Yy1iMTcxLWI2MWIyMmJlOTJmNC8iLCJvaWQiOiI0MzcwZDY3NC02YTY4LTRmYzMtYTg1ZS1hODVkZDViNTc3NjQiLCJyaCI6IjAuQVJnQTBueldyYkxJYkVHeGNiWWJJcjZTOU9GakFHNTBXekJIbWNZckZVRVVUbHdZQUFBLiIsInN1YiI6IjQzNzBkNjc0LTZhNjgtNGZjMy1hODVlLWE4NWRkNWI1Nzc2NCIsInRpZCI6ImFkZDY3Y2QyLWM4YjItNDE2Yy1iMTcxLWI2MWIyMmJlOTJmNCIsInV0aSI6IjVpUjhHTHMwdzBpaDAta2NnRFVhQUEiLCJ2ZXIiOiIxLjAifQ.pTHv-l7jRooXo2_oi5Iad3R9hl8pt03BtyCNc0iQHFJyYJ4w1Ancq5MInjaMKxmm3MlqoZkNrRqlbHb4XrWjLIg_SsKmSwPidDX7lYnSHgYWLpPlNPq33ZYbIQLRh5FO3Ol7lkqNqm1sAANv9SEZBfGmbHWISaEhxA6s9c2WWYQFNPdxPf0X2ER3rkgkGQuSqs_rY80IZbG28yuJqL0QRiT8iHNWMH9nk8m0pYiW4B8SvDYgSyaJb3QKu4_gFyOtU_UGNIsIew1PRizZ5JR8VuAkpD5yOATvy7VCr_69tNWAb7EylKWqvD1Wgx5W6kS5S0NJNqPtE-S7GWclJXC2nw'



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
