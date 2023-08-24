

const OPENAI_KEY = "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";

const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json()); // parse JSON requests
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/api/chat', async (req, res) => {
  
});

app.post('/api/general', async (req, res) => {
  
});

app.post('/api/image', async (req, res) => {
  
})

app.post('/api/recipe', async (req, res) => {
  
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
