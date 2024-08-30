const express = require("express");
const app = express();
const PORT = 8060;
const path = require("path");
var session = require("express-session");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "group g6",
    resave: false,
    saveUninitialized: true,
  })
);
function isAuthenticated(req,res,next){
    if(req.session.isAuth!=true){
        return res.redirect("/login")
    }
  
    next()
}
app.get("/",isAuthenticated,(req, res) => {
    res.redirect("/profile")
});
app.get("/profile",isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public/profile.html"));
  });
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/register.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"));
});
app.post("/register", (req, res) => {
  let { email, password } = req.body;
//   console.log(req.session);
  req.session.email = email;
  req.session.password = password;
//   console.log(req.session);
  res.redirect("/login");
});
app.post("/login", (req, res) => {
  let { email, password } = req.body;
  if (email == req.session.email && password == req.session.password) {
    req.session.isAuth=true
    return res.redirect("/");
  }
  res.redirect("/login");
});
app.get("/logout",(req,res)=>{
    req.session.destroy()
    res.redirect("/login")
})

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on PORT ${PORT}`);
  }
});