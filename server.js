const express = require('express');
// router object
const router = express.Router();
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');

const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blog')(router);

const port = process.env.port || 8080; 

// Set up mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err)=>{
  if (err) {
    console.log("Can't connect to db: ", err);
  }
  else {
    //console.log("Secret: ", config.secret)
    console.log("Connected to database: ", config.db);
  }
});

// Middleware
// cors
app.use(cors({
  origin: 'http://localhost:4200'
}));
//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Static files folder
app.use(express.static(__dirname + '/client/dist/'));
// routes
app.use('/authentication', authentication);
app.use('/blogs', blogs);


app.get('*', (req, res) => {
  //res.send('It is well with my soul');
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(port , () => {
    console.log('Running the server on port: ', port);
});

 