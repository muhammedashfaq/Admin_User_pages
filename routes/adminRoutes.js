const express=require('express')
const admin_Route=express()

const session=require("express-session")
const config=require("../config/config")
admin_Route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:true,
    resave:false
}))


const bodyParser=require('body-parser')
admin_Route.use(bodyParser.json())
admin_Route.use(bodyParser.urlencoded({extended:true}))

admin_Route.set('view engine','ejs')
admin_Route.set('views','./views/admin')

const auth=require("../middleware/adminAuth")


const adminController=require("../controllers/adminController")
admin_Route.get('/',auth.isLogout,adminController.loadLogin)

admin_Route.post('/',adminController.varifyLogin)
admin_Route.get('/home',auth.isLogin,adminController.loadDashboar)
admin_Route.get('/logout',auth.isLogin,adminController.logout)
admin_Route.get('/dashboard',auth.isLogin,adminController.adminDashboard)
admin_Route.post("/dashboard",adminController.searchUser)

admin_Route.get('/new_user',auth.isLogin,adminController.newUserLoad)
admin_Route.post('/new_user',adminController.addUser)

admin_Route.get('/edit-user',auth.isLogin,adminController.editUserLoad)
admin_Route.post('/edit-user',auth.isLogin,adminController.updateUser)


admin_Route.get('/delete-user',adminController.deleteUser)


admin_Route.get('*',function (req,res){

    res.redirect('/admin')
    
    })
    
module.exports=admin_Route