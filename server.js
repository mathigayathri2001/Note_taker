const fs = require('fs');
const express = require ('express');
const path = require ('path');

const app = express();
const PORT = process.env.PORT || 3000

const OUTPUT_DIR = path.resolve(__dirname, "db")
const outputPath = path.join(OUTPUT_DIR, "db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
const notes = require ('./db/db.json');

let id_num = 1

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
  });
  app.get('/api/notes', function( req,res){
    console.log(notes)
    res.json(notes)

})

  app.get ('*',function(req, res){
      res.sendFile(path.join(__dirname,'public/index.html'))
  })

  app.post('/api/notes', function (req, res) {
    const newNote = req.body
   newNote.routeName = newNote.title.replace(/\s+/g, "").toLowerCase();
   newNote.id = id_num++
    notes.push(newNote)
   fs.writeFile(outputPath, JSON.stringify(notes), function (err) {
    //fs.writeFile('./db/db.json', JSON.stringify(notes), function (err) {
      if (err) {
          throw err
      }
  })
    res.json(newNote)
  })









app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`))