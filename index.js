const express = require('express');
const request = require('request-promise');
const PORT = process.env.PORT || 3000;
const app = express();
var os = require('os');
require("dotenv").config();
const isbot = require('isbot');
const { detect } = require('detect-browser');
const browser = detect();
app.use(express.json());
const helmet = require('helmet');
app.use(helmet())
app.disable('x-powered-by')


//
app.get('/', async (req, res) => {
    try {
        const ip = await request(`https://api.ipify.org/`);
        const detectorapi = await request(`https://vpnapi.io/api/${ip}?key=${process.env.detectorapi_key}`)
        const detector = JSON.parse(detectorapi)
        const response = await request(`http://ip-api.com/json/`);
        const countryCode = JSON.parse(response);
        res.json({
            ip: ip,
            country: countryCode.country,
            platform: os.platform(),
            browser: browser.name,
            vpn: detector.security.vpn,
            proxy: detector.security.proxy,
            tor: detector.security.tor,
            isbot: isbot(req.get('user-agent')),


        });
    } catch (error) {
        res.json(error);
    }
});






app.listen(PORT, () => console.log(`Server Running at: http://localhost:${PORT}`));