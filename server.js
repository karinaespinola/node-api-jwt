require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const cors = require('cors');

// Connect to MongoDB
connectDB();

// Allow CORS 
app.use(cors());
// Built-in middleware to handle urlencoded
// in other words, form data;
// 'CONTENT-TYPE: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

app.use(express.json());


mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  });
});
