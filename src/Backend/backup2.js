const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const mammoth = require("mammoth");
const cors = require('cors');
const fs = require('fs');

// const WordExtractor = require("word-extractor"); 
// const extractor = new WordExtractor();
// const extracted = extractor.extract("./Uploads/Documentation.docx");

app.use((req,res,next)=>{
res.header("Access-Control-Allow-Origin","*");
res.header(
  "Access-Control-Allow-Headers",
  "GET,POST,OPTION,PUT,DELETE,HEAD"
)
res.header(
  "Access-Control-Allow-Headers",
  "origin, X-Requested-With, Content-type, Accept"
)
next();


})
const Multer=require("./utils/multer")
const MulterServerSide=require("./utils/multerServerSide")
const Model = require('./Model/Mongo');
const cloudinary = require('./utils/cloudinary')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const port = 3100


// -------- Show Data from MongoDb ----------- //


app.get('/', (req, res) => {

  console.log("/");
  
  Model.find({name:"admin3"},(err, data) => {
    res.send({ status: "ok", content: data })
  })

  // extracted.then(function(doc) { 
  //   console.log(doc.getHeaders());
  //   res.send({ status: "ok", content: doc.getBody({includeHeadersAndFooters:true})})
  // });
})

app.post('/deleteDocumentation', (req, res) => {

  console.log(req.body);
  console.log(req.body.data);
  console.log("/deleteDocumentation");

  const path = './Uploads/Documentation.docx';

  
  Model.findOneAndDelete({name:"admin3"},(err, data) => {
    fs.unlink(path, (err) => {

    console.log("fileDeleted")

    req.body.data.map(data => {
      try { cloudinary.uploader.destroy(data);console.log(data); }
      catch (error) { console.log(error) }
  })

      res.send("fileDeleted")

      if (err) {
        console.error(err)
    
      }
    })
    
  })

})

// -------- Check if documentation is available ----------- //

app.get('/checkdocument', (req, res) => {

  console.log('/checkdocument');

  const path = './Uploads/Documentation.docx';


  if (fs.existsSync(path)) {
    res.send('file avilable');
  } else {
    res.send('file not avilable');
  }

})



// -------- Convert Doc into Html ----------- //

app.get('/doctohtml', (req, res) => {

  console.log("/doctohtml");

  try {
    const path = './Uploads/Documentation.docx';

    if (fs.existsSync(path)) {

      console.log('true');
    console.log("105");
      mammoth.convertToHtml({ path: path })
      .then(function (result) {
        console.log("108");

        var html = result.value;
        console.log("111");
        console.log(result);

        res.send({ status: "ok", content: html })
      }).done();
 
    }
  } catch (error) { res.send('error');console.log(error); }

})

app.post("/uploadFile", (req, res) => {
 
  console.log("uploadFile");

  MulterServerSide(req, res, async function (err) {
    if (err) {
      res.status(400);
      throw new Error(err);
    }
  })

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
  const imagesLinks = []
      Promise.all(req.body.uploadedFile.map(async (data, index) => { 
        const result = await cloudinary.uploader.upload(data)
      imagesLinks.push(`${result.secure_url}`);
      return result.secure_url
    }))

  .then(() => {res.send(imagesLinks);})
  .catch((error)=> { console.log(error) })
  
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
