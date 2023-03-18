const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/user_mangement_system")

const express=require("express")
const app=express()

//for cache controll
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

//for user routes
const userRoute=require('./routes/userRoutes')
app.use('/',userRoute)

//for user routes
const adminRoute=require('./routes/adminRoutes')

app.use('/admin',adminRoute)






app.listen(3000, () => {
  console.log("server connected PORT:3000");
});
