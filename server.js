const express = require('express');
const app = express();

// Use the port cloud platforms provide, or default to 3000 locally
const PORT = process.env.PORT || 3000;

// This object acts as the temporary holding envelope for the number
let data_map = {};

// 1. Controller app hits this route to save the phone number
app.get('/dial', (req, res) => {
    const phoneNumber = req.query.number;
    if (phoneNumber) {
        data_map = { number: phoneNumber };
        console.log("[Server] Received target number: " + phoneNumber);
        res.send("Target phone signaled to call: " + phoneNumber);
    } else {
        res.send("No number provided in the URL parameter.");
    }
});

// 2. Receiver app hits this route every 5 seconds to check for a number
app.get('/check', (req, res) => {
    if (data_map.number) {
        console.log("[Server] Delivering number to receiver app: " + data_map.number);
        
        // Send the current data envelope to the VOW VOW app
        res.json(data_map);
        
        // CRUCIAL: Clear the data immediately after delivering it
        // This stops the infinite machine-gun calling loop!
        data_map = {};
    } else {
        // Send an empty response so the receiver app skips dialing
        res.json({});
    }
});

// Bind to 0.0.0.0 so external devices/networks can connect smoothly
app.listen(PORT, '0.0.0.0', () => {
    console.log("Server running smoothly on port " + PORT);
});
