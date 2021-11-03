const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('656997554804-vjh9rt3m8s57pb8p5skao4qhv6qp5p51.apps.googleusercontent.com');
// const Cookie = require('js-cookie')
var cookieParser = require('cookie-parser');

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieParser());

authPass = async (req, res, next) => {
  var myCookie = req.cookies['hellocookie']
    if (myCookie == null) {
      return res.redirect("/");
    }
    else{
      return res.send(`<a href="/logout">Logout</a>`)
    }
  next()
}

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/one.html'))
})

app.post('/dashboard',(req,res)=>{
    const { credential } = req.body
    console.log(credential)
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: '656997554804-vjh9rt3m8s57pb8p5skao4qhv6qp5p51.apps.googleusercontent.com'
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  const token = jwt.sign({ _id: userid }, "Hellothisismyid", { expiresIn: "1d" })
  res.cookie("hellocookie", token, {
    httpOnly: false,
  })
  console.log(payload)
//   res.status(200).json({
//       payload
//   })
  res.sendFile(path.join(__dirname+'/log.html'))
}
verify().catch(console.error);
// console.log(req.body)
})

app.get('/logout', (req, res) => {
  res.cookie('hellocookie', '', {expires: new Date(0)});
    res.redirect('/');
})

app.get('/check',authPass,(req, res)=>{
  res.sendFile(path.join(__dirname+'/google.html'))
})

app.listen(7000, console.log(`Server running in 7000`))