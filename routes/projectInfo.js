const express = require('express');
const router = express.Router();
const data = require("../data");


var bcrypt = require('bcrypt');


router.get('/', async function (req, res) {
  if(req.user){
    if(req.user.type == 'Estimator'){
      var passedVariable = req.session.projectName;
  

      var obj1 = {}
      if (passedVariable) {
    
        const a12 = await data.estimators.getProjectByName(req.user._id, passedVariable);
        obj1 = { PN: a12.pName, PDE: a12.description, SD: a12.startDate, DD: a12.due, ON: a12.owner };
    
      }else{
        req.session.projectName = null;
      }
      obj1.isEdit = passedVariable;
      res.render("projectInfo", { obj: obj1 });
    }else{
         res.redirect('/');
    }
    
}else{
    req.session.error = "Please Log In First";
    return res.redirect('/')
}

 
});




router.post("/", async function (req, res) {
  if (req.body.update_project) {

    const a12 = await data.estimators.getProjectByName(req.user._id, req.body.project_name);

    var somethingToUpdate = false;
    let objectReadyToUpdate = {};


    if (a12.description !== req.body.project_description) {
      somethingToUpdate = true;
      objectReadyToUpdate.description = req.body.project_description;

    }

    if (a12.startDate !== req.body.start_date) {
      somethingToUpdate = true;
      objectReadyToUpdate.startDate = req.body.start_date;

    }

    if (a12.due !== req.body.due_date) {
      somethingToUpdate = true;
      objectReadyToUpdate.due = req.body.due_date;

    }

    if (a12.owner !== req.body.owner_name) {
      somethingToUpdate = true;
      objectReadyToUpdate.owner = req.body.owner_name;

    }
    if (somethingToUpdate) {
      const a2 = await data.estimators.updateProject(req.user._id, req.body.project_name, objectReadyToUpdate);
    }
    req.session.projectName = req.body.project_name;
    res.redirect("/estimator");

    // const prj = await data.estimators.addProject(req.user._id, req.body.project_name, req.body.project_description, req.body.start_date, req.body.due_date, req.body.owner_name);
  }
  if (req.body.delete_project) {
    const prj = await data.estimators.deleteProject(req.user._id, req.body.project_name);
    res.redirect("/");
    
  }
  if (req.body.save_project) {
    const prj = await data.estimators.addProject(req.user._id, req.body.project_name, req.body.project_description, req.body.start_date, req.body.due_date, req.body.owner_name);
    req.session.projectName = req.body.project_name;
    res.redirect("/estimator");

  }



 



});
module.exports = router;