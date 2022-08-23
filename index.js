const express = require('express');
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser');
const multer = require('multer');
const { upload_data } = require('./controller/controller');
const connectDB = require('./db/connect');


const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });  //upload file to public/uploads
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/api/uploadFile', upload.single("uploadfile"), upload_data)


app.listen(8000, async () => {   // port 3000
    await connectDB();
    console.log('Server started on port 8000');
});