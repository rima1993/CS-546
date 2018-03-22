const express = require('express');
const router = express.Router();
const data = require("../data");
const vendorData = data.vendors;
const estimatorData = data.estimators;
var bcrypt = require('bcrypt');

router.post("/", async (req, res) => {
    if(req.body.password !== req.body.confirm_password)
    {
        return res.render('./Signup', { message:'Password are not match. Try Again'});
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)!== true) 
    {
        return res.render('./Signup', { message:'Not valid Email ID. Try Again'});
    }

    var myPlaintextPassword = req.body.password;
    var hashPassword = await bcrypt.hash(myPlaintextPassword,10);
    var user;
    if(req.body.User_type=='Vendor')
    {
        try{
        user = await vendorData.createVendor(req.body.companyname,
            req.body.firstname,req.body.lastname,req.body.contact,
            req.body.zip,req.body.email,hashPassword);
        }catch(err)
        {
            return res.render('./Signup', { message:  err});
        }
    }
    else if(req.body.User_type=='Estimator')
    {
        try{
        user = await estimatorData.createEstimator(req.body.companyname,
            req.body.firstname,req.body.lastname,req.body.contact,
            req.body.zip,req.body.email,hashPassword);
        }catch(err)
        {
            return res.render('./Signup', { message:  err});
        }
    }
    
    if(user){
        res.render('./Login', { message:  "SignUp successful"});
    }
    else{
        res.render('./Signup', { message:  "SignUp unsuccessful. Please do it again"});
    }
});

module.exports = router;