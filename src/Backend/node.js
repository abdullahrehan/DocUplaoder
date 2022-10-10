const express = require('express')
const app = express();
const routes = express.Router();
const bodyParser = require('body-parser');
var mammoth = require("mammoth");
const cors = require('cors');

const Multer = require('./utils/multer');
const Model = require('./Model/Mongo');
const cloudinary = require('./utils/cloudinary')
// const upload = Multer({ dest: './public/data/uploads/' })

const port = 3100

app.use(cors()); 
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));



app.get('/', (req, res) => { 
  res.send('Hello World!')
})

app.get('/data', (req, res) => { 
  Model.find((err,data)=>{
    console.log(data);
    res.send({status:"ok",content:data})
  })
})

app.post("/uploadDocument", Multer.single("uploadedFile"),async (req, res) => {
  console.log(req.file, req.body)

})

  
app.get('/doc', (req, res) => {

  console.log('doc');
  try {
    mammoth.convertToHtml({path: "demo.docx"})
    .then(function(result){
        var html = result.value; 
        res.send({status:"ok",content:html}) 
      }).done();  

      
  } catch (error) {
    res.send('error')
  }
     
  
  })

  app.post('/savedoc', async(req, res) => {

    console.log("savedoc",req.body.data);
        const insertNewUserModel =await Model({
          doc:req.body.data 
        })
        insertNewUserModel.save()
        res.send({status:"ok",data:req.body.data}) 
     
    })

  app.post("/uploads", Multer.array("uploadedFile", 10),async (req, res) => {
      console.log("uploads");
    const a=[]
    Promise.all(req.body.uploadedFile.map(async (data, index) => {

    const result = await cloudinary.uploader.upload(data)
    a.push(`${result.secure_url}`);
    console.log(result.secure_url);

    return result.secure_url 
    })).then(()=>res.send(a))
    
  })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
