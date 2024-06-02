const express = require('express');
const cors = require('cors');
const dboperations = require('./dbOperations');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


app.get('/api/details', async (req, res) => {
  const { offset, limit, search = '', booleanSearch = false } = req.query;
  try {
    const result = await dboperations.getDetails(parseInt(offset) || 0, parseInt(limit) || 10, search.toLowerCase(), booleanSearch === 'true');
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/api/user-details/:contactNo', async (req, res) => {
  const { contactNo } = req.params;
  try {
    const result = await dboperations.getUserDetails(contactNo);
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/api/update-user-details/:contactNo', async (req, res) => {
  const { contactNo } = req.params;
  const userDetails = req.body;
  try {
    await dboperations.updateUserDetails(contactNo, userDetails);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.get('/api/data', async (req, res) => {
  try {
      const result = await dboperations.getData();
      res.json(result);
  } catch (err) {
      res.status(500).send(err.message);
  }
});

app.get('/api/data1', async (req, res) => {
  try {
      const result = await dboperations.getData1();
      res.json(result);
  } catch (err) {
      res.status(500).send(err.message);
  }
});

app.get('/api/ug-degrees', async (req, res) => {
  try {
      const result = await dboperations.getUgDegrees();
      res.json(result);
  } catch (err) {
      res.status(500).send(err.message);
  }
});

app.get('/api/pg-degrees', async (req, res) => {
  try {
      const result = await dboperations.getPgDegrees();
      res.json(result);
  } catch (err) {
      res.status(500).send(err.message);
  }
});

app.get('/api/ann-salaries', async (req, res) => {
  try {
      const result = await dboperations.getAnnSalaries();
      res.json(result);
  } catch (err) {
      res.status(500).send(err.message);
  }
});
app.get('/api/years-of-experience', async (req, res) => {
  try {
      const result = await dboperations.getYearsOfExperience();
      res.json(result);
  } catch (err) {
      res.status(500).send(err.message);
  }
});
app.get('/api/age-ranges', async (req, res) => {
  try {
      const result = await dboperations.getAgeRanges();
      res.json(result);
  } catch (err) {
      res.status(500).send(err.message);
  }
});


app.get('/api/filter', async (req, res) => {
  try {
    const { roles, locations, ug_degrees, pg_degrees, ann_salaries, years_of_experience, Gender, Age, page, limit } = req.query;
    const result = await dboperations.getFiltered(roles, locations, ug_degrees, pg_degrees, ann_salaries, years_of_experience, Gender, Age, parseInt(page) || 1, parseInt(limit) || 10);
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});