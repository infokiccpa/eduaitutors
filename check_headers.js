const https = require('https');

const url = 'https://d36f5jgespoy2j.cloudfront.net/12%20phy%20edit_720.m3u8';

https.get(url, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    res.on('data', () => { });
}).on('error', (e) => {
    console.error(e);
});
