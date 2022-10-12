const express = require('express')
const app = express();
const bodyParser = require('body-parser');
var mammoth = require("mammoth");
const cors = require('cors');
const multer = require("multer")
const path = require('path')
const fs = require('fs');
const Multer=require("./utils/multer")

const Model = require('./Model/Mongo');
const cloudinary = require('./utils/cloudinary')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const port = 3100

// -------- Multer Documentation Upload ----------- //


// app.use('/public', express.static(path.join(__dirname, 'Uploads')))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads')
  },
  filename: (req, file, cb) => {
    cb(null, `Documentation${path.extname(file.originalname)}`)
  }
})

const upload = multer({ storage: storage }).single('file')
const uploadMultiple = multer({ storage: storage }).array("file", 10)


// -------- Show Data from MongoDb ----------- //


app.get('/', (req, res) => {
  console.log("hello");
  Model.find({name:"admin3"},(err, data) => {
    console.log(data);
    res.send({ status: "ok", content: data })
  })
})

// -------- Check if documentation is available ----------- //

app.get('/checkdocument', (req, res) => {

  const path = './Uploads/Documentation.docx';

  if (fs.existsSync(path)) {
    res.send('file avilable');
  } else {
    res.send('file not avilable');
  }

})


// -------- Convert Doc into Html ----------- //

app.get('/doctohtml', (req, res) => {

  try {

    // const path = './Uploads/Documentation.docx';

    // if (fs.existsSync(path)) {
    //   res.send('file avilable');
    

    mammoth.convertToHtml({ path: "./Uploads/Documentation.docx" })
      .then(function (result) {
        var html = result.value;
        // console.log(html);
        res.send({ status: "ok", content: html })
      }).done();
    // }  
    //   else {
    //     res.send('file not avilable');
      // }
  } catch (error) { res.send('error') }

})

app.post("/uploadFile", (req, res) => {
 
  console.log("uploadFile");
  // console.log(req.file);
  upload(req, res, async function (err) {
    if (err) {
      res.status(400);
      throw new Error("Error uploading images.");
    }
  })
  // console.log(req.body.uploadedFile);
  res.send("ok")
});


// -------- Save Data in MongoDb ----------- //

app.post('/savedoc', async (req, res) => {

  console.log("savedoc");
  const insertNewUserModel = await Model({
    doc: req.body.data,
    name: "admin3"
  })
  insertNewUserModel.save()
  res.send({ status: "ok", data: req.body.data })

})

// -------- Upload Images in Cloudinary and Return Images links ----------- //


app.post("/uploads",Multer.array("file", 10),async (req, res) => {

  console.log("/uploads");
  console.log(req.body.uploadedFile);
    //  console.log(req.files);
//  uploadMultiple(req, res, async function (err) {
  //  if (err) {

//      console.log("/uploads");
//      console.log(req.body.uploadedFile);
//      console.log(req.files);
// console.log("uploads");
//     res.send("ok");
    const a = []
    try {
          Promise.all(req.body.uploadedFile.map(async (data, index) => {
 
  
 
      const result = await cloudinary.uploader.upload(data)
      a.push(`${result.secure_url}`);
 
      return result.secure_url
    }))
    .then(() => {res.send(a);console.log(a)})
  }catch (error) {
      console.log(error);
    }
  // }
//  })
  

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
