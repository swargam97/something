const express=require('express')
const user=require('../models/users')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomEmail,sendCancelEmail}=require('../emails/accounts')
const router=new express.Router()
router.post('/users',async (req,res)=>{
    // console.log(req.body)

    // async await code
    const nUser=new user(req.body)
    try {
      await nUser.save()
      const token=await nUser.generateAuthToken()
      sendWelcomEmail(nUser.email,nUser.name)
      res.status(201).send({nUser,token})
    } catch (error) {
      res.status(400).send(error)
    }
    // old promise code
    // nUser.save().then(()=>{
    //   res.send(nUser)
    // }).catch((e)=>{
    //   res.status(400).send(e)
    // })
    // res.send('testing');
})
router.post('/users/login',async (req,res)=>{
  try {
    const loginUser=await user.findByCredentials(req.body.email,req.body.password)
    const token=await loginUser.generateAuthToken()
    res.send({loginUser,token})
  } catch (error) {
    res.status(400).send()
  }
})
router.post('/users/logout',auth,async (req,res)=>{
  try {
    req.user.tokens=req.user.tokens.filter((token)=>{
      return token.token !==req.token
    })
    await req.user.save()
    res.send('Logout successfull')
  } catch (error) {
    res.status(500).send()
  }
})
router.post('/users/logoutAll',auth,async (req,res)=>{
  try {
    req.user.tokens=[]
    await req.user.save()
    res.send('LogoutAll successfull')
  } catch (error) {
    res.status(500).send()
  }
})
router.get('/users/me',auth,async (req,res)=>{
    res.send(req.user)
    // async await way
    // try {
    //   const userall=await user.find({})
    //   res.send(userall)
    // } catch (error) {
    //   res.status(500).send(error)
      
    // }
  
    // old promise chainig way
    // user.find({}).then((users)=>{
    //   res.send(users)
    // }).catch((e)=>{
    //   res.status(500).send()
    // })
  })
  router.patch('/users/me',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    // console.log(updates)
    const allowedupdates=['name','email','password','age']
    const isvalidate=updates.every((update)=>allowedupdates.includes(update))
    if(!isvalidate){
      return res.status(400).send({error:'invalid updates'})
    }
    try {
      // const user1=await user.findById(req.params.id);
      const user1=req.user
      updates.forEach((update)=>user1[update]=req.body[update])
      await user1.save()
      // const user1 = await user.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  
      // if (!user1) {
      //     return res.status(404).send()
      // }
  
      res.send(user1)
  } catch (e) {
      res.status(400).send(e)
  }
  })
  const me=multer({
    limits:{
      fileSize:1000000
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg!png)$/)) {
          return cb(new Error('Please upload a Image'))
      }
  
      cb(undefined, true)
  }
  
  })
  router.post('/users/me/avater',auth,me.single('avater'),async (req,res)=>{
    // req.user.avatar=req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send("Upload succesfull")
  },(error,req,res,next)=>{
    res.status(400).send({Error:error.message})
  })
  router.delete('/users/me',auth,async (req,res)=>{
    try {
        sendCancelEmail(req.user.email,req.user.name)
        await req.user.remove()
        res.send(req.user)
      }
      catch (error) {
      return res.status(500).send(error)
    }
  })
  router.delete('/users/me/avater',auth,async (req,res)=>{
    req.user.avatar=undefined
    try {
      await req.user.save()
      res.send('delete succesful')
    } catch (error) {
      res.status(500).send(error)
    }
  })
router.get("/users/:id/avater",async (req,res)=>{
  try {
    const fuser=await user.findById(req.params.id)
    if(!fuser||!fuser.avatar){
      throw new Error()
    }
    res.set('Content-type','image/jpg')
    res.send(fuser.avatar)
  } catch (error) {
    
  }
})

module.exports=router