const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const app = express()
const port = 3000

const db = require('./config/db_connection')

app.use(express.json())

const AuthRouter = require('./router/authRouter')
app.use('/api', AuthRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });