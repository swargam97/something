const mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})


// const nUser=new user({
//     password:'pass'
// })
// nUser.save().then(()=>{
//     console.log(nUser)
// }).catch((error)=>{
//     console.log(error)
// })




// const eating=new task({
//     description:'cleaning       ',
//     // Status:false
// })
// eating.save().then(()=>{
//     console.log(eating)
// }).catch((error)=>{
//     console.log(error);
// })