const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const securePassword=async(password)=>{
    try {
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
        
    }}

const { findById } = require("../models/userModel");
const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};
const varifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_admin === 0) {
          res.render("login", {
            message: "you dont have permission to access",
          });
        } else {
          req.session.user_id = userData._id;
          res.redirect("/admin/home");
        }
      } else {
        res.render("login", { message: "enter the correct mail and password" });
      }
    } else {
      res.render("login", { message: "enter the email and password correctly" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadDashboar = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("home", { admin: userData });
  } catch (error) {
    console.log(error.message);
  }
};
const logout = async (req, res) => {
  try {
    const userData = await User.findById({ _id: req.session.user_id });
    res.render("home", { admin: userData });
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};
const adminDashboard = async (req, res) => {
  try {
    const userData = await User.find({ is_admin: 0 });
    res.render("dashboard", { users: userData });
  } catch (error) {
    console.log(error.message);
  }
};

//Add new work start

const newUserLoad = async (req, res) => {
  try {
    res.render("new_user");
  } catch (error) {
    console.log(error.message);
  }
};
// adding user
const addUser = async (req, res) => {
  try {
    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const gender = req.body.gender;
    const mobile = req.body.mob;
    const spassword=await securePassword(req.body.password);

 //already mail
    const alreadyyMail = await User.findOne({email:email})
    console.log(alreadyyMail);
    if(alreadyyMail){
        res.render('new_user',{alert:"email already exist"})

    }
    else{

 
      const user = new User({
        name: name,
        email: email,
        mob: mobile,
        gender:gender,
        password: spassword,
  
        is_admin:0
      });
      const userData = await user.save();
      if (userData) {
        res.redirect("/admin/dashboard");
      } else {
        res.render("new_user", { message: "something wrong" });
      }



    }
   
  } catch (error) {
    console.log(error.message);
  }
};

//edit user functionality

const editUserLoad = async (req,res) => {
  try {
    const id=req.query.id
    const edtData=await User.findById({_id:id})
    if(edtData){
      res.render("edit-user",{data:edtData})
    }

    res.render("edit-user");
  } catch (error) {
    console.log(error.message);
  }
};

const updateUser=async(req,res)=>{
try {
  const name = req.body.name;
  if(name.trim().length==0){
    res.redirect('/admin/dashboard')
  }else{
 const userData=await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mob:req.body.mob}})
  res.redirect('/admin/dashboard')
}
} catch (error) {
  console.log(error.message);
  
}

};

//delete user

const deleteUser=async(req,res)=>{
  try {
     const id=req.query.id
     await User.deleteOne({_id:id})
     res.redirect('/admin/dashboard')
  } catch (error) {
    console.log(error.message)
    
  }
}



const searchUser =async (req,res)=>{
   try {

    const searchValue =req.body.search
    console.log(searchValue);
    const search =searchValue.trim()

    if(search!=''){
        let users =await User.find({$and:[{name:{$regex: `^${search}`,$options:'i'}},{is_admin : 0}]});
        
            res.render('dashboard',{users:users})
    }  
  }
    catch (error) {

    console.log(error.message);
    
   }
  

}
module.exports = {
  loadLogin,
  varifyLogin,
  loadDashboar,
  logout,
  adminDashboard,
  newUserLoad,
  addUser,
  editUserLoad,
  updateUser,
  deleteUser,
  securePassword ,
  searchUser
     
};
