const express = require('express');
const router = express.Router();
const data = require("../data");
const vendorData = data.vendors;
const estimatorData = data.estimators;
var bcrypt = require('bcrypt');

router.post("/addMaterial", async (req, res) => {
    
    try{
    await vendorData.addMaterial(req.user._id,req.body.name,
                req.body.description,req.body.unitCost,req.body.inStock,
                req.body.discount,req.body.discountQty);
        res.send("done");
    }
    catch(err)
    {
        console.log(err);
        res.send(err);
    }
});

router.post("/updateMaterial", async (req, res) => {
    
    try{
       
    await vendorData.updateMaterial(req.user._id,req.body.name,req.body);
   
    res.send("done");
    }
    catch(err)
    {
        console.log(err);
        res.send(err);
    }
});

router.post("/deleteMaterial", async (req, res) => {
    
    try{
    await vendorData.deleteMaterial(req.user._id,req.body.name);
    res.send("done");
    }
    catch(err)
    {
        console.log(err);
        res.send(err);
    }
});

module.exports = router;