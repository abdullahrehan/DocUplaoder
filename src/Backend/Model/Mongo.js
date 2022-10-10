const mongoose=require("mongoose")
mongoose.connect(process.env.MONGODB_URI || 
"mongodb+srv://Rehan:123%40qwerty@testing.hv5ln.mongodb.net/test",
{useNewUrlParser:true,useUnifiedTopology:true})

const Schema=new mongoose.Schema({
    doc:Object,
  
})
 
const Model=new mongoose.model("document2",Schema)
 
module.exports=Model
