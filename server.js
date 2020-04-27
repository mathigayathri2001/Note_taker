// Dependency modules
const fs = require('fs');
const express = require('express');
const path = require('path');
const notes = require('./db/db.json');

//Sets up the Express App and port number
const app = express();
const PORT = process.env.PORT || 3000

//Output path to save the file
const OUTPUT_DIR = path.resolve(__dirname, "db")
const outputPath = path.join(OUTPUT_DIR, "db.json");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));


let id_num = 1

//get html route request
app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//get api route request
app.get('/api/notes', function (req, res) {
    console.log(notes)
    res.json(notes)
})

// If no matching route is found default to home
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

//api to post resquest and create newNote with id 
app.post('/api/notes', function (req, res) {
    const newNote = req.body
    newNote.routeName = newNote.title.replace(/\s+/g, "").toLowerCase();
    newNote.id = id_num++
    notes.push(newNote)
    fs.writeFile(outputPath, JSON.stringify(notes), function (err) {
        if (err) {
            throw err
        }
    })
    res.json(newNote)
})

//api to delete based on provided id
app.delete('/api/notes/:id', function (req, res) {
    let noteId = parseInt(req.params.id);
    for (let i = 0; i < notes.length; i++) {
        if (noteId === notes[i].id) {
            notes.splice(i, 1);
            fs.writeFile(outputPath, JSON.stringify(notes), function (err) {
                if (err) {
                    throw err
                }
            })
        }
    }
    res.json(notes)
})

app.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`))