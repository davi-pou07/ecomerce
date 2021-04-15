function adminAuth(req,res,next){
    if(req.session.usu != undefined){
        next()
    }else{
        res.redirect("/login")
    }
}

module.exports = adminAuth