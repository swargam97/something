const express=require('express')
require('./db/mongoose')
// const user=require('./models/users')
// const task=require('./models/task')
const userRouter=require("./router/user")
const taskRouter=require('./router/task')
const app=express()
const port=process.env.PORT

// const multer=require('multer')
// const upload = multer({
//   dest: 'images',
//   limits: {
//       fileSize: 1000000
//   },
//   fileFilter(req, file, cb) {
//       if (!file.originalname.match(/\.(doc|docx)$/)) {
//           return cb(new Error('Please upload a Word document'))
//       }

//       cb(undefined, true)
//   }
// })
// const me=multer({
//   dest:'avater',
//   limits:{
//     fileSize:1000000
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg!png)$/)) {
//         return cb(new Error('Please upload a Image'))
//     }

//     cb(undefined, true)
// }

// })
// app.post('/upload',upload.single('upload'),(req,res)=>{
//    res.send()
// },(error,req,res,next)=>{
//   res.status(400).send({Error:error.message})
// })

app.use(express.json())
// app.use((req,res,next)=>{
//   res.status(503).send('Maintenace')
// })
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
  console.log(`Server is starting at ${port}`)
})