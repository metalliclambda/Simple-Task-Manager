const express = require('express');
const ejs = require('ejs');
let bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/zzTaskTestDB', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("DB Connected");
});

const taskSchema = new mongoose.Schema({
    taskText: String,    
});

const Task = mongoose.model('Task', taskSchema);

let testDataArray = [
    {
        taskText : "Test data"
    }
]

app.get('/', (req, res) => {    
    Task.find(function (err, results) {
        if (err) return console.error(err);
        res.render('index', {tasks: results});    
    });
    
    
});

app.post('/update-task' , (req,res) => {
    let id = req.body.id;
    let newText = req.body.newText;
    
    // To Update the Task in DB you can use either of these ways :
    
    // solution 1 :
    Task.findById(id, function (err, doc) {
        if (err) {
            console.error(err);
        }
        doc.taskText = newText;
        doc.save();
    });
    
    // solution 2 :
    // Task.findByIdAndUpdate(id , {taskText : newText} , (err , doc)=>{
    
    // });
    
    res.redirect('/');
});

app.post('/new-task' , (req,res) => {
    let newTaskFromClient = req.body.newTask;
    if (newTaskFromClient){
        const taskToDB = new Task({ 
            taskText : newTaskFromClient,
        });
        taskToDB.save( (err , data) => {
            if(err) {
                console.error(err);
            }
        });
    }
    res.redirect('/');
});

app.post("/delete" , (req , res) => {
    let id = req.body.id;

    Task.findByIdAndDelete(id , (err , doc)=> {
        if(err) {
            console.error(err);
        }
    })

    res.redirect('/');
});

app.listen(3000 , () => {
    console.log("Server runs at 3000");
})
