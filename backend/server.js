const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // [NEW] Import koneksi DB
const apiRoutes = require('./routes/api');

// [NEW] Inisialisasi koneksi ke MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Hanya jalankan app.listen jika tidak dijalanakan via serverless function (Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
  });
}

// [NEW] Export app untuk Vercel
module.exports = app;
