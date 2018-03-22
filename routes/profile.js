const express = require("express");
const router = express.Router();
const data = require("../data");
const estimatordata = data.estimators;
const vendordata = data.vendors;
const connection = require("../config/mongoConnection");
var bcrypt = require('bcrypt');

router.get("/", async(req, res) => {

    if (req.user) {
        let a1 = {}
        let typeVal ={}
        if (req.user.type == 'Vendor') {
            a1 = await data.vendors.getVendorById(req.user._id);
        } else {
            a1 = await data.estimators.getEstimatorById(req.user._id);
        }
        let obj1 = { FN:a1.firstName, LN:a1.lastName, ZP:a1.zip, PH:a1.phone, EM:a1.email, PD:a1.password};
        res.render("./Profile", {obj:obj1, type:typeVal});

    }else{
        res.redirect('/');
    }
  });
  
  router.post("/", async (req, res) => {
   
  
  if(req.user.type == "Estimator"){

      const a12 = await estimatordata.getEstimatorById(req.user._id);
      
      
      var somethingToUpdate = false;
      let objectReadyToUpdate = {};
     
      
      if(a12.firstName !== req.body.edit_firstname){
        somethingToUpdate = true;
        objectReadyToUpdate.firstName = req.body.edit_firstname; 
      
      }
      
      if(a12.lastName !== req.body.edit_lastname){
        somethingToUpdate = true;
        objectReadyToUpdate.lastName = req.body.edit_lastname; 
      
      }
      
      
      if(a12.zip !== req.body.edit_zip){
        somethingToUpdate = true;
        objectReadyToUpdate.zip = req.body.edit_zip; 
       
      }
    
      
     if(a12.phone !== req.body.edit_mobileno){
        somethingToUpdate = true;
        objectReadyToUpdate.phone = req.body.edit_mobileno; 
      
      }

      let new_password = req.body.edit_password;
      let confirmpassword = req.body.edit_confirmpassword;
      let password = req.body.password;

      if(password !== new_password && new_password == confirmpassword && new_password !== "") {
        somethingToUpdate = true;
        objectReadyToUpdate.password = await bcrypt.hash(new_password,10);
  
       }
       

     if(somethingToUpdate){

      const e2 = await estimatordata.updateEstimator(req.user._id,objectReadyToUpdate);
     }
      const a1 = await estimatordata.getEstimatorById(req.user._id);
      let obj1 = { FN:a1.firstName, LN:a1.lastName, ZP:a1.zip, PH:a1.phone, PD:a1.password};
      res.redirect("/");
     
    }

    else
    {
      const a3 = await vendordata.getVendorById(req.user._id);

      
      var somethingToUpdate = false;
      let objectReadyToUpdate = {};

      
      if(a3.firstName !== req.body.edit_firstname){
        somethingToUpdate = true;
        objectReadyToUpdate.firstName = req.body.edit_firstname; 
      
      }
      
      if(a3.lastName !== req.body.edit_lastname){
        somethingToUpdate = true;
        objectReadyToUpdate.lastName = req.body.edit_lastname; 
      
      }
      
      
      if(a3.zip !== req.body.edit_zip){
        somethingToUpdate = true;
        objectReadyToUpdate.zip = req.body.edit_zip; 
       
      }
    
      
     if(a3.phone !== req.body.edit_mobileno){
        somethingToUpdate = true;
        objectReadyToUpdate.phone = req.body.edit_mobileno; 
      
      }

      let new_password = req.body.edit_password;
      let confirmpassword = req.body.edit_confirmpassword;
      let password = req.body.password;

      if(password !== new_password && new_password == confirmpassword && new_password !== "") {

        somethingToUpdate = true;
        objectReadyToUpdate.password = await bcrypt.hash(new_password,10);
  
       }
       
      
      if(somethingToUpdate){
      const e3 = await vendordata.updateVendor(req.user._id,objectReadyToUpdate);
     }
    
      const a2 = await vendordata.getVendorById(req.user._id);
      let obj1 = { FN:a2.firstName, LN:a2.lastName, ZP:a2.zip, PH:a2.phone, PD:a2.password};
      res.redirect("/");

    
    }
    
    });



  module.exports = router;