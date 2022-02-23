//jshint esversion:6

const express = require("express");

const app = express();
const csrf = require("csurf");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cookieParser=require("cookie-parser")
 var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));



var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://resource-de762-default-rtdb.firebaseio.com",
});
const csrfmiddleware = csrf({ cookie: true });






app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfmiddleware);
app.all("*",(req,res,next)=>{
  res.cookie("XSRF-TOKEN",req.csrfToken());
  next();
})
app.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});
app.get("/",function (req,res) {
  res.sendFile(__dirname + '/login.html');
  // res.render('index.html');
});
app.get("/course",function (req,res) {
  res.sendFile(__dirname + '/course.html');
});
app.get("/event",function (req,res) {
  res.sendFile(__dirname + '/event.html');
});
app.get("/contact",function (req,res) {
  res.sendFile(__dirname + '/contact.html');
});

app.get("/home",function (req,res) {
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then(() => {
    res.sendFile(__dirname + '/index.html');
    })
    .catch((error) => {
    res.redirect("/");
    });


});
app.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/");
});
app.get("/dsa",function (req,res) {
  res.sendFile(__dirname + '/dsa.html');
});
app.get("/dbms",function (req,res) {
  res.sendFile(__dirname + '/dbms.html');
});
app.get("/os",function (req,res) {
  res.sendFile(__dirname + '/os.html');
});
app.get("/cn",function (req,res) {
  res.sendFile(__dirname + '/cn.html');
});
app.get("/oops",function (req,res) {
  res.sendFile(__dirname + '/oops.html');
});


app.listen(3000,function () {
  console.log("server started on port 3000");
});
