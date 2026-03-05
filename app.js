require('dotenv').config()

//server connection 
const express = require('express')
const app = express()

//database connection 
const databaseConnection  = require('./Database/index.js')
databaseConnection()

// to show json in browser
app.use(express.json());

// importing module 
 const personDetail = require('./Model/personModel.js')

 //importing multer 

const upload = require('./middleware/multerConfig.js')
const path = require('path');
app.use('/Storage', express.static(path.join(__dirname, 'Storage')));

const fs = require('fs')

const cors = require('cors')
app.use(cors({
    origin : 'https://react-rd3k.vercel.app/'
}))


app.post('/blog', upload.single('Photo'),async(req,res)=>{

    const {Name,Age, Grade} = req.body;
    let filename;
    if(req.file){
    filename = req.file.filename
    }
    
    await personDetail.create({
        Name,
        Age, 
        Grade, 
        Photo : filename
    })
    res.json({
        message : "Post api is hit "
    })
})

app.get('/blog',async (req,res)=>{
   const persons = await personDetail.find()

    res.status(200).json({
        message : "Fetched all data ",
        data : persons
    
    })
})

// to get single id 
app.get('/blog/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const person = await personDetail.findById(id);

        if (!person) {
            return res.status(404).json({
                message: "Data not found"
            });
        }

        res.status(200).json({
            message: "Fetched data successfully",
            data: person
        });

    } catch (error) {
        res.status(500).json({
            message: "Invalid ID or server error",
            error: error.message
        });
    }
});

app.delete('/blog/:id',async (req,res)=>{
 try{
 const id = req.params.id
 const deleteperson = await  personDetail.findByIdAndDelete(id);
 const image = deleteperson.Photo

 if(!deleteperson){
    return res.status(400).json({
        message : "person is not found"
    })
 }
 if(deleteperson.Photo){
    const imagePath = path.join(__dirname,"Storage",deleteperson.Photo)
    if(fs.existsSync(imagePath)){
        fs.unlinkSync(imagePath);
        console.log('Photo are deleted')
    }
 }
  res.status(200).json({
        message : "person data deleted successful",
        data : deleteperson
    })

 }
 catch(error){
    res.status(500).json({
        message : "server error ",
        error : error.message
    })
 }
   
})

//update

app.patch('/blog/:id', upload.single("Photo"), async (req, res) => {
    try {
        const { Name, Age, Grade } = req.body;

        const findPerson = await personDetail.findById(req.params.id);

        if (!findPerson) {
            return res.status(404).json({
                message: "Person data not existed"
            });
        }

        const updateData = {
            Name,
            Age,
            Grade
        };

        // If new image uploaded
        if (req.file) {

            // delete old image
            if (findPerson.Photo) {
                const oldimagePath = path.join(__dirname, "Storage", findPerson.Photo);

                if (fs.existsSync(oldimagePath)) {
                    fs.unlinkSync(oldimagePath);
                    console.log("Old image deleted successfully");
                }
            }

            // Save new image name
            updateData.Photo = req.file.filename;
        }

        await personDetail.findByIdAndUpdate(req.params.id, updateData);

        res.status(200).json({
            message: "Person updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


app.listen(process.env.PORT || 4000,()=>{
    console.log('server is running on the port 3000')
})