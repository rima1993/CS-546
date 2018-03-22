const express = require('express');
const router = express.Router();
const data = require("../data");
const vendorData = data.vendors;
const estimatorData = data.estimators;
var bcrypt = require('bcrypt');

router.get('/', async function (req, res) {
    if(req.user){
        if(req.user.type == 'Estimator'){
            req.session.projectName = null; //11
            const estimator = await data.estimators.getEstimatorById(req.user._id);
        let estimatorProjects = [];
        estimator.projects.forEach(function (element) {
            let obj = {PN:element.pName};
            estimatorProjects.push(obj);
        }, this);
        res.render('./ProjectLists', {myProjectsList:estimatorProjects,user:estimator}) 
        }else{
             res.redirect('/');
        }
        
    }else{
        req.session.error = "Please Log In First";
        return res.redirect('/')
    }
});

router.post('/', function (req, res, next) {
   
    let a = "";
    if(req.body.add_project){
        req.session.projectName = false;
        res.redirect("/projectInfo");
    }
    if (req.body.pname){
        req.session.projectName = req.body.pname;
        res.redirect('/estimator');
        // req.session.editName = req.body.pname;
        // res.redirect("/projectInfo");
    }
    
});
module.exports = router;