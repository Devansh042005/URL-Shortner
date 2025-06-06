const express = require('express');
const router = express.Router();

router.get('/' , async (req,res) => {
    if(!req.user) return res.redirect('/login');
    const allurls = await URL.find({createdBy: req.user._id})
    return res.render("home" , {
        urls: allurls
    })
})

router.get('/singup' , (req,res) => {
    return res.render("singup");
})

router.get('/login' , (req,res) => {
    return res.render("login");
})
module.exports = router;