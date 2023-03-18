const user=require('../models/userModel')
const bcrypt=require('bcrypt');

const securePassword=async(password)=>{
    try {
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
        
    }

}

const loadRegister=async(req,res)=>{
    try{
        res.render("registration")
    }
    catch(error){
        console.log(error.message )

    }
}
const insertUser=async(req,res)=>{

    try {

        const spassword=await securePassword(req.body.password);

        const email = req.body.email;
        const alreyMail = await user.findOne({email:email})
        console.log(alreyMail);
        if(alreyMail){
            res.render('registration',{message:"email already exist"})
        }else{

            const User=new user({
                name:req.body.name,
                email:req.body.email,
                mob:req.body.mob,
                gender:req.body.gender,
                password:spassword,
                is_admin:0
                
            })
            
           
            const userData  =await User.save();
            if(userData){
                res.render('login')
            }
            else{
                res.render('registration',{message:'registration failed'})
            }
        }
        
    } catch(error) {
        console.log(error.message);
        
    }
}
//logiin user method started
const loginLoad=async(req,res)=>{
    try {
        res.render("login")
      
        
    } catch (error) {
        console.log(error.message)   
    }
}
const varifyLogin=async(req,res)=>{
    try {
        const email=req.body.email
        const password=req.body.password
       const userData=await user.findOne({email:email})
       
       if (userData) {
        
        
        const passwordMatch=await bcrypt.compare(password,userData.password)
        console.log(passwordMatch)
        if (passwordMatch) {
             req.session.user_id=userData.id
            res.redirect('home');
            
        } else {
          
            res.render('login',{message:"check your email or password entered correcltly"})
            
        }
       } else {
        res.render('login',{message:"enter the correct mail and password"})
        
       }
        
    } catch (error) {
        console.log(error.message);
       
        
    }
}
const loadHome=async(req,res)=>{
    try {
        res.render('home')
        
    } catch (error) {
        console.log(error.message);
    }
}
const userLogout=async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports={loadRegister,
insertUser,
loginLoad,
varifyLogin,
loadHome,
userLogout}