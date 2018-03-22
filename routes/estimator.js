const express = require('express');
const router = express.Router();
const data = require("../data");
const vendorData = data.vendors;
const estimatorData = data.estimators;
var bcrypt = require('bcrypt');
const util = require('util');

router.post("/", async (req,res) => {
  
    if(req.body.edit_project && req.session.projectName){
        res.redirect("/projectInfo");
    }
    if(req.body.home_page_e_link && req.session.projectName){
        req.session.projectName = null;
        res.redirect("/projectLists");
    }
});



router.post("/getVendor", async (req, res) => {
    
    try{
    
    const lst = await vendorData.getVendorsByMaterialName(req.body.mName);
    
    
        if(lst.length > 0){

        //const str= JSON.stringify(lst);
        res.send(lst);
        }
        else{
            res.send('0');
        }
    }
    catch(err)
    {
        console.log(err);
        res.send('0');
    }
});

router.post("/addMaterial", async (req, res) => {

    if(req.body.vValue=='Other Vendor')
    {
        try{
        await estimatorData.addMaterialToProject(req.user._id,req.body.pName,
        req.body.mName,'Other Vendor','No Description',req.body.unitcost,'0','0',req.body.qty);
        res.send('done');
        }
        catch(err)
        {
            console.log(err);
            res.send(err);
        }

    }
    else{
    
    try{
        var ven = await vendorData.getVendorByUserName(req.body.vValue);
        var mat;
        for(let i=0;i<ven.materials.length;i++)
        {
            if(ven.materials[i].name == req.body.mName)
            {
                mat = ven.materials[i];
                break;
            }
        }
        await estimatorData.addMaterialToProject(req.user._id,req.body.pName,
        req.body.mName,req.body.vValue,mat.description,req.body.unitcost,mat.discount,mat.discountQty,req.body.qty);
        res.send("done");
    }
    catch(err)
    {
        console.log(err);
        res.send(err);
    }
}
});

router.post("/getDetails", async (req, res) => {
    
    try{
    
    const det = await estimatorData.getProjectByName(req.user._id,req.body.pName);
    var mat;
    for(let i=0;i<det.materials.length;i++)
    {
        if(det.materials[i].mName == req.body.mName &&
            det.materials[i].vName == req.body.vValue &&
            det.materials[i].qty == req.body.qty)
        {
            mat = det.materials[i];
            break;
        }
    }
    
    res.send(mat);
    
    }
    catch(err)
    {
        console.log(err);
        res.send('0');
    }
});

router.post("/deleteMaterial", async (req, res) => {
    
    try{
    
    await estimatorData.deleteMaterialFromProject(req.user._id,req.body.pName,req.body.mName,req.body.vName);
    
    }
    catch(err)
    {
        console.log(err);
        res.send(err);
    }
});

router.post("/editMaterial", async (req, res) => {
    
    try{
    var dataToupdate;
    if(req.body.vName == "Other Vendor")
    {
        dataToupdate = req.body;
        dataToupdate.discount = 0;
        dataToupdate.discountQty = 0;
    }
    else
    {
    const vend = await vendorData.getVendorByUserName(req.body.vName);
    for(var i=0;i<vend.materials.length;i++)
    {
        if(vend.materials[i].name == req.body.mName)
        {
            dataToupdate = vend.materials[i];
            dataToupdate.vName = req.body.vName;
            dataToupdate.qty = req.body.qty;
            
            break;
        }
    }
    
    }
    await estimatorData.updateMaterialInProject(req.user._id,
        req.body.pName,req.body.mName,dataToupdate);

    res.send("done");
    }
    catch(err)
    {
        console.log(err);
        res.send(err);
    }
});




module.exports = router;
