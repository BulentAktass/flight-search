import express from 'express';
import axios from 'axios';

const app = express();
const port = 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/flights', async (req, res) => {
  try {
    const { from, to, departDate } = req.query;

    const response = await axios.get('https://api.schiphol.nl/public-flights/flights', {
      headers: {
        'app_id': 'e36b4867',
        'app_key': 'b6e44b4bad5f1e79dc8a868fc4f9659d',
        'Accept': 'application/json',
        'ResourceVersion': 'v4',
      },
      params: {
        scheduleDate: departDate,
        route: `${from}-${to}`,
        includedelays: false,
        page: 0,
        sort: '+scheduleTime'
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching flights.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
