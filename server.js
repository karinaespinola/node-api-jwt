require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const cors = require('cors');
const apiErrorHandler = require('./middleware/ErrorHandler');

// Connect to MongoDB
connectDB();

// Allow CORS 
app.use(cors());
// Built-in middleware to handle urlencoded
// in other words, form data;
// 'CONTENT-TYPE: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// Routers
app.use('/user', require('./routes/api/user'));

app.use('/auth', require('./routes/api/auth'));

app.use(apiErrorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  });
});
