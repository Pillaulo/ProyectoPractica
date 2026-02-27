require('dotenv').config();

const express = require('express');
const cors = require('cors');
const storyRoutes = require('./routes/storyRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { getDatabase, closeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());

getDatabase();

app.use('/api', storyRoutes);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  closeDatabase();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  server.close();
  process.exit(0);
});
