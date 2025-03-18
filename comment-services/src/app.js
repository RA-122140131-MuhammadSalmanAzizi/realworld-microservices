const express = require('express');
const bodyParser = require('body-parser');
const commentRoutes = require('./routes/comments');
const sequelize = require('./config/db');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', commentRoutes);

// Sync database and start server
const PORT = process.env.PORT || 3003;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Comment Service running on port ${PORT}`);
  });
});