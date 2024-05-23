const express = require('express');
const cors = require('cors');
const dboperations = require('./dbOperations');
const app = express();
const port = 3001;

app.use(cors());

app.get('/api/details', async (req, res) => {
  const { offset, limit } = req.query;
  try {
    const result = await dboperations.getDetails(parseInt(offset) || 0, parseInt(limit) || 20);
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
