const express = require('express');
const app = express();

// Bitta route
app.get('/', (req, res) => {
    res.send('Salom, Express ishlayapti!');
});

// Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi`);
});
