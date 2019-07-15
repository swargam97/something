const sgMail=require('@sendgrid/mail')
const api_key=process.env.SENDGRID_API_KEY
sgMail.setApiKey(api_key)
const sendWelcomEmail=(email,name)=>{
    sgMail.send({
  to:email,
  from:'swargam2009@gmail.com',
  subject:'Welcome Homie',
  text:`Hello ${name} welcome to our app.We hope to serve u better task`
})
}
const sendCancelEmail=(email,name)=>{
    sgMail.send({
    to:email,
    from:'swargam2009@gmail.com',
    subject:'Why Homie',
    text:`Homie ${name} is there anything we can do to help u`
})
}

module.exports={
    sendWelcomEmail,
    sendCancelEmail
}