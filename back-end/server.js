const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))

const mongoose = require('mongoose');
// connect to the database
mongoose.connect('mongodb://localhost:27017/Players', {
  useNewUrlParser: true
})
//upload multer
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});
// Create a scheme for items in the museum: a title and a path to an image.
const playerSchema = new mongoose.Schema({
  name: String,
  number: String,
  path: String,
  points: String,
  rebounds: String,
  assists: String,
});
// Create a model for items in the museum.
const Player = mongoose.model('Players', playerSchema);

app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});
// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/players', async (req, res) => {
  console.log(req.body.name)
  const player = new Player({
    name: req.body.name,
    number: req.body.number,
    path: req.body.path,
    points: req.body.points,
    rebounds: req.body.rebounds,
    assists: req.body.assists
  });
  try {
    await player.save()
    res.send(player);
    console.log("passing images to db " + player.name + " " + player.path)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

});
app.get('/api/players', async (req, res) => {
  try {
    console.log("calling players api")
    let players = await Player.find();
    res.send(players);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.put('/api/players/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    let player = await Player.findOne({
      _id: req.params.id
    })
    //console.log(req.params.title);
    //  console.log(req.title)
    player.name = req.body.name;
    player.number = req.body.number;
    player.points = req.body.points;
    player.rebounds = req.body.rebounds;
    player.assists = req.body.assists
    await player.save();
    res.send(200)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
 app.delete('/api/players/:id', async (req, res) => {
  try {
    console.log(req.params.id)
    await Player.deleteOne({
      _id: req.params.id
    })
    res.send(200)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.listen(3000, () => console.log('Server listening on port 3000!'));
