const express = require('express')
const mongoose = require('mongoose')
const Clipboard = require('./models/clipboard')
require('dotenv').config(); 

const cors = require('cors');
PORT = 3000
app = express()
const URI = process.env.URI

mongoose.connect(URI)
    .then(()=>console.log('DB Connected!'))
    .catch((err)=> console.error(err));
app.use(cors({ origin:process.env.FURL, credentials: true }));
app.use(express.json());

app.get('/',(req,res) => {
    res.send('hello from server')
})

app.post('/api/clipboard', async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ error: 'Clipboard data is required' });
        }

        const code = await generateUniqueFourDigitCode(); // Generate code before saving
        const newEntry = await Clipboard.create({ code, data });

        res.status(201).json({ code: newEntry.code }); // Return only the code
    } catch (error) {
        console.error('Error saving clipboard data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/clipboard/:code', async (req, res) => {
    try {
        const { code } = req.params;

        const entry = await Clipboard.findOne({ code });
        if (!entry) {
            return res.status(404).json({ error: 'Code not found' });
        }

        res.status(200).json({ data: entry.data });
    } catch (error) {
        console.error('Error fetching clipboard data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper function for code generation
async function generateUniqueFourDigitCode() {
    let code;
    let exists = true;
    while (exists) {
        code = Math.floor(1000 + Math.random() * 9000).toString();
        exists = await Clipboard.exists({ code });
    }
    return code;
}

app.listen(PORT , () => { console.log('server runinng on port : ', PORT)})

