import express from 'express';

const app = express();

// express middlewares for url and json format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// serve static files from the React app
app.use(express.static('../../client/dist'));

// serve the React app for any route !== /api
app.get('*', (req, res) => {
  res.sendFile('../../client/dist/index.html');
});

app.listen(3000);