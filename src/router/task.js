const express=require('express')
const task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()
router.post('/task',auth,async (req,res)=>{
    // const ntask=new task(req.body)
    const ntask=new task({
      ...req.body,
      owner:req.user._id
    })
     try {
       await ntask.save();
       res.status(201).send(ntask)
     } catch (e) {
       res.status(400).send(e)
     }
   //  ntask.save().then(()=>{
   //    res.send(ntask)
   //  }).catch((e)=>{
   //    res.status(400).send(e)
   //  })
 })
 
 
 router.get('/task',auth,async (req,res)=>{
   const match={}
   const sort={}
   if(req.query.status){
     match.Status=req.query.status==='true'
   }
   if(req.query.sortBy){
     const parts=req.query.sortBy.split(':')
     sort[parts[0]]=parts[1]==='desc' ? -1:1
   }

   try {
    await req.user.populate({
      path:'tasks',
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.send(req.user.tasks)
   } catch (error) {
     res.status(500).send(error)
   }
   // task.find({}).then((tasks)=>{
   //   res.send(tasks);
   // }).catch((e)=>{
   //   res.status(500).send()
   // })
 })
 router.get('/task/:id',auth,async (req,res)=>{
   const id=req.params.id
   console.log(req.user._id)
   try {
     const ftask=await task.findOne({_id:id,owner:req.user._id})
     console.log(ftask)
     if(!ftask){
       return res.status(404).send()
     }
     res.send(ftask)
   } catch (error) {
     res.status(500).send()
   }
 
   // task.findById(id).then((ftask)=>{
   //   if(!ftask){
   //     res.status(404).send()
   //   }
   //   res.send(ftask)
   // }).catch((e)=>{
   //   res.status(500).send()
   // })
 })
 
 router.patch('/task/:id',auth,async (req,res)=>{
   const updates=Object.keys(req.body)
   // console.log(updates)
   const allowedupdates=['description','Status']
   const isvalidate=updates.every((update)=>allowedupdates.includes(update))
   if(!isvalidate){
     return res.status(400).send({error:'invalid updates'})
   }
   try {
      const task1=await task.findOne({_id:req.params.id,owner:req.user})
      if (!task1) {
        return res.status(404).send()
    }
      updates.forEach((update)=>task1[update]=req.body[update])
      await task1.save()

    //  const task1 = await task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
 
    
 
     res.send(task1)
 } catch (e) {
     res.status(400).send(e)
 }
 })
 router.delete('/task/:id',auth,async(req,res)=>{
   try {
     const deltask=await task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
     if(!deltask){
       return res.status(404).send()
     }
     res.send(deltask)
   } catch (error) {
     return res.status(500).send(error)
   }
 })
 


module.exports=router