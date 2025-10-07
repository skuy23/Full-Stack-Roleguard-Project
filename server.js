require('dotenv').config();
const { connectDB } = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 4000;

(async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
