const mongoCollections = require("../config/mongoCollections");
const estimators = mongoCollections.estimators;
const uuid = require("node-uuid");
const util = require('util');

const exportedMethods = {



    async getEstimatorById(id) {
        const estimatorsCollection = await estimators();
        const estimator = await estimatorsCollection.findOne({ _id: id }, { password: 0 });
        if (!estimator) throw "No Estimator found with given id data";
        return estimator;
    },

    async getProjectByName(id, pName) {
        const estimatorsCollection = await estimators();
        const estimator = await estimatorsCollection.findOne({ _id: id, "projects.pName": pName }, { password: 0 });
        if (!estimator) throw "No Estimator found with given id data";
        let estimatorProject = {};
        estimator.projects.forEach(function (element) {
            if (element.pName == pName) {
                estimatorProject = element;
            }
        }, this);
        estimatorProject._id = id;
        return estimatorProject;
    },

    async getEstimatorVerification(email) {
        const estimatorsCollection = await estimators();
        const estimator = await estimatorsCollection.findOne({ email: email });
        if (!estimator) throw "No Estimator found with given email";
        return { userName: estimator.userName, password: estimator.password, _id: estimator._id };
    },


    async createEstimator(userName, firstName, lastName, phone, zip, email, password) {
        if (typeof userName != "string" || userName.length <= 0) throw "No valid User Name provided";
        if (typeof firstName != "string" || firstName.length <= 0) throw "No valid First Name provided";
        if (typeof lastName != "string" || lastName.length <= 0) throw "No valid Last Name provided";
        if (typeof phone != "string" || phone.length <= 0) throw "No valid Phone provided";
        if (typeof zip != "string" || zip.length <= 0) throw "No valid Zip provided";
        if (typeof email != "string" || email.length <= 0) throw "No valid Email provided";
        if (typeof password != "string" || password.length <= 0) throw "No valid password provided";

        projects = [];

        const estimatorsCollection = await estimators();
        const estimatorList = await estimatorsCollection.find().toArray();
        estimatorList.forEach(function (element) {
            if (element.email == email) {
                throw "user exists with same email, try another"
            }
        }, this);

        const newEstimator = {
            _id: uuid.v4(),
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            zip: zip,
            email: email,
            password: password,
            projects: projects
        };

        const newInsertInformation = await estimatorsCollection.insertOne(newEstimator);

        const newId = newInsertInformation.insertedId;

        var out = await this.getEstimatorById(newId);
        return out;
    },


    async updateEstimator(id, estimatorDataToUpdate) {

        const estimatorsCollection = await estimators();
        const estimatorToUpdate = await this.getEstimatorById(id);
        if (!estimatorToUpdate) throw "estimator not found for update";

        let estimatorReadyToUpdate = {};
        let someToUpdate = false;

        if (estimatorDataToUpdate.hasOwnProperty("firstName")) {
            someToUpdate = true;
            if (typeof estimatorDataToUpdate.firstName != "string" || estimatorDataToUpdate.firstName.length <= 0) {
                console.log("Invalid first name");
                throw "Invalid first name";
            }
            estimatorReadyToUpdate.firstName = estimatorDataToUpdate.firstName;
        }

        if (estimatorDataToUpdate.hasOwnProperty("lastName")) {
            someToUpdate = true;
            if (typeof estimatorDataToUpdate.lastName != "string" || estimatorDataToUpdate.lastName.length <= 0) {
                console.log("Invalid last name");
                throw "Invalid last name";
            }
            estimatorReadyToUpdate.lastName = estimatorDataToUpdate.lastName;
        }

        if (estimatorDataToUpdate.hasOwnProperty("userName")) {
            someToUpdate = true;
            if (typeof estimatorDataToUpdate.userName != "userName" || estimatorDataToUpdate.userName.length <= 0) {
                console.log("Invalid user name");
                throw "Invalid user name";
            }
            esttmatorReadyToUpdate.userName = estimatorDataToUpdate.userName;
        }

        if (estimatorDataToUpdate.hasOwnProperty("phone")) {
            someToUpdate = true;
            if (typeof estimatorDataToUpdate.phone != "string" || estimatorDataToUpdate.phone.length <= 0) {
                console.log("Invalid phone");
                throw "Invalid phone";
            }
            estimatorReadyToUpdate.phone = estimatorDataToUpdate.phone;
        }

        if (estimatorDataToUpdate.hasOwnProperty("zip")) {
            someToUpdate = true;
            if (typeof estimatorDataToUpdate.zip != "string" || estimatorDataToUpdate.zip.length <= 0) {
                console.log("Invalid zip");
                throw "Invalid zip";
            }
            estimatorReadyToUpdate.zip = estimatorDataToUpdate.zip;
        }

        if (estimatorDataToUpdate.hasOwnProperty("email")) {
            someToUpdate = true;
            if (typeof estimatorDataToUpdate.email != "string" || estimatorDataToUpdate.email.length <= 0) {
                console.log("Invalid email");
                throw "Invalid email";
            }
            estimatorReadyToUpdate.email = estimatorDataToUpdate.email;
        }

        if (estimatorDataToUpdate.hasOwnProperty("password")) {
            someToUpdate = true;
            if (typeof estimatorDataToUpdate.password != "string" || estimatorDataToUpdate.password.length <= 0) {
                console.log("Invalid password");
                throw "Invalid password";
            }
            estimatorReadyToUpdate.password = estimatorDataToUpdate.password;
        }

        if (!someToUpdate) {
            throw "nothing to update";
        }

        let updateCommand = {
            $set: estimatorReadyToUpdate
        };

        const query = {
            _id: id
        };

        await estimatorsCollection.updateOne(query, updateCommand);

        const estimator = await this.getEstimatorById(id);
        if (!estimator) throw "No updates estimator found with given id data"

        return estimator;
    },

    async addProject(estimatorId, pName, description, startDate, due, owner) {

        if (typeof pName != "string" || pName.length <= 0) throw "No valid name provided";
        if (typeof description != "string" || description.length <= 0) throw "No valid material description provided";
        if (typeof startDate != "string" || startDate.length <= 0) throw "No valid startDate provided";
        if (typeof due != "string" || due.length <= 0) throw "No valid due provided";
        if (typeof owner != "string" || owner.length <= 0) throw "No valid owner provided";

        const estimatorsCollection = await estimators();

        const v1 = await this.getEstimatorById(estimatorId);

        v1.projects.forEach(function (element) {
            if (element.pName == pName) {
                throw "project exists with same name, try another name"
            }
        }, this);

        materials = [];

        const newProject = {
            pName: pName,
            description: description,
            startDate: startDate,
            due: due,
            owner: owner,
            materials: materials
        };

        await estimatorsCollection.update({ _id: estimatorId }, { $push: { projects: newProject } });

        return newProject;
    },

    async updateProject(EstimatorId, pName, projectDataUpdate) {

        const estimatorsCollection = await estimators();

        const projectToUpdate = await this.getEstimatorById(EstimatorId);
        if (!projectToUpdate) throw "estimator not found for update";

        let projectReadyToUpdate = {};
        let someToUpdate = false;

        // if (projectDataUpdate.hasOwnProperty("pName")) {
        //     someToUpdate = true;
        //     if (typeof projectDataUpdate.pName != "string" || projectDataUpdate.pName.length <= 0) {
        //         throw "Invalid name";
        //     }
        //     projectReadyToUpdate['projects.$.pName'] = projectDataUpdate.pName;
        // }

        if (projectDataUpdate.hasOwnProperty("description")) {
            someToUpdate = true;
            if (typeof projectDataUpdate.description != "string" || projectDataUpdate.description.length <= 0) {
                throw "Invalid description";
            }
            projectReadyToUpdate['projects.$.description'] = projectDataUpdate.description;
        }

        if (projectDataUpdate.hasOwnProperty("startDate")) {
            someToUpdate = true;
            if (typeof projectDataUpdate.startDate != "string" || projectDataUpdate.startDate.length <= 0) {
                throw "Invalid Unit Cost";
            }
            projectReadyToUpdate['projects.$.startDate'] = projectDataUpdate.startDate;
        }

        if (projectDataUpdate.hasOwnProperty("due")) {
            someToUpdate = true;
            if (typeof projectDataUpdate.due != "string" || projectDataUpdate.due.length <= 0) {
                throw "Invalid due";
            }
            projectReadyToUpdate['projects.$.due'] = projectDataUpdate.due;
        }

        if (projectDataUpdate.hasOwnProperty("owner")) {
            someToUpdate = true;
            if (typeof projectDataUpdate.owner != "string" || projectDataUpdate.owner.length <= 0) {
                throw "Invalid owner";
            }
            projectReadyToUpdate['projects.$.owner'] = projectDataUpdate.owner;
        }

        if (projectDataUpdate.hasOwnProperty("ownerQty")) {
            someToUpdate = true;
            if (typeof projectDataUpdate.ownerQty != "string" || projectDataUpdate.ownerQty.length <= 0) {
                throw "Invalid owner quantity";
            }
            projectReadyToUpdate['projects.$.ownerQty'] = projectDataUpdate.ownerQty;
        }


        if (!someToUpdate) {
            throw "nothing to update";
        }

        let updateCommand = {
            $set: projectReadyToUpdate
            // {"materials.$.due":projectDataUpdate.due}
        };

        const query = {
            _id: EstimatorId,
            "projects.pName": pName
        };

        await estimatorsCollection.updateOne(query, updateCommand);

        const estimator = await this.getEstimatorById(EstimatorId);
        if (!estimator) throw "No updates estimator found with given id data"

        return estimator;

    },

    async deleteProject(EstimatorId, pName) {

        const estimatorsCollection = await estimators();

        const estimatorToUpdate = await this.getEstimatorById(EstimatorId);
        if (!estimatorToUpdate) throw "estimator not found for update";

        await estimatorsCollection.update({ _id: EstimatorId }, { $pull: { projects: { "pName": pName } } });

        return { "project deleted": "true" };

    },

    async addMaterialToProject(EstimatorId, pName, mName, vName, description, unitCost, discount, discountQty, qty) {

        if (typeof vName != "string" || vName.length <= 0) throw "No valid name provided";
        if (typeof mName != "string" || mName.length <= 0) throw "No valid name provided";
        if (typeof description != "string" || description.length <= 0) throw "No valid material description provided";
        if (typeof unitCost != "string" || unitCost.length <= 0) throw "No valid unitCost provided";
        if (typeof discount != "string" || discount.length <= 0) throw "No valid discount provided";
        if (typeof discountQty != "string" || discountQty.length <= 0) throw "No valid discount quantity provided";
        if (typeof qty != "string" || qty.length <= 0) throw "No valid quantity provided";

        const estimatorsCollection = await estimators();
        // const v1 = await this.getProjectByName(EstimatorId, pName);
        const newMaterial = {
            mName: mName,
            description: description,
            unitCost: unitCost,
            discount: discount,
            discountQty: discountQty,
            vName: vName,
            qty: qty
        };
        await estimatorsCollection.update(
            { "_id": EstimatorId, "projects.pName": pName },
            {
                "$push":
                    { "projects.$.materials": newMaterial }
            }
        );

        return newMaterial;
    },

    async updateMaterialInProject(EstimatorId, pName, mName, materialDataToUpdate) {
        const estimatorsCollection = await estimators();

        const estimatorToUpdate = await this.getEstimatorById(EstimatorId);
        if (!estimatorToUpdate) throw "vendor not found for update";

        let materialReadyToUpdate = {};
        let someToUpdate = false;

        // if (materialDataToUpdate.hasOwnProperty("name")) {
        //     someToUpdate = true;
        //     if (typeof materialDataToUpdate.name != "string" || materialDataToUpdate.name.length <= 0) {
        //         throw "Invalid name";
        //     }
        //     materialReadyToUpdate['projects.0.materials.$.name'] = materialDataToUpdate.name;
        // }

        var objList = await estimatorsCollection.findOne({"_id": EstimatorId,"projects.pName": pName});
        
        objList.projects[0].materials.forEach(function (element) {

            if (element.mName == mName) {
               element.vName= materialDataToUpdate.vName;
               element.qty = materialDataToUpdate.qty;
               element.unitCost=materialDataToUpdate.unitCost;
               element.discount=materialDataToUpdate.discount;
               element.discountQty=materialDataToUpdate.discountQty;
            }
        }, this);

        

        if (materialDataToUpdate.hasOwnProperty("vName")) {
            
            someToUpdate = true;
            if (typeof materialDataToUpdate.vName != "string" || materialDataToUpdate.vName.length <= 0) {
                throw "Invalid vendor Name";
            }
            materialReadyToUpdate['projects.0.materials.$.vName'] = materialDataToUpdate.vName;
        }

        if (materialDataToUpdate.hasOwnProperty("description")) {
            someToUpdate = true;
            if (typeof materialDataToUpdate.description != "string" || materialDataToUpdate.description.length <= 0) {
                throw "Invalid description";
            }
            materialReadyToUpdate['projects.0.materials.$.description'] = materialDataToUpdate.description;
        }

        if (materialDataToUpdate.hasOwnProperty("unitCost")) {
            
            someToUpdate = true;
            if (typeof materialDataToUpdate.unitCost != "string" || materialDataToUpdate.unitCost.length <= 0) {
                throw "Invalid Unit Cost";
            }
            materialReadyToUpdate['projects.0.materials.$.unitCost'] = materialDataToUpdate.unitCost;
        }

        if (materialDataToUpdate.hasOwnProperty("qty")) {
            someToUpdate = true;
            if (typeof materialDataToUpdate.qty != "string" || materialDataToUpdate.qty.length <= 0) {
                throw "Invalid qty";
            }
            materialReadyToUpdate['projects.0.materials.$.qty'] = materialDataToUpdate.qty;
        }

        // if (materialDataToUpdate.hasOwnProperty("discount")) {
        //     someToUpdate = true;
        //     if (typeof materialDataToUpdate.discount != "string" || materialDataToUpdate.discount.length <= 0) {
        //         throw "Invalid discount";
        //     }
        //     materialReadyToUpdate['projects.0.materials.$.discount'] = materialDataToUpdate.discount;
        // }

        // if (materialDataToUpdate.hasOwnProperty("discountQty")) {
        //     someToUpdate = true;
        //     if (typeof materialDataToUpdate.discountQty != "string" || materialDataToUpdate.discountQty.length <= 0) {
        //         throw "Invalid discount quantity";
        //     }
        //     materialReadyToUpdate['projects.0.materials.$.discountQty'] = materialDataToUpdate.discountQty;
        // }



        // if (!someToUpdate) {
        //     throw "nothing to update";
        // }
        

        let obj = {}
        obj['projects.0.materials']= objList.projects[0].materials;

        let updateCommand = {
            $set: obj
        };


        const query = {
            "_id": EstimatorId,
            "projects.pName": pName
        };
        
        await estimatorsCollection.updateOne(query, updateCommand);
        
        const estimator = await this.getEstimatorById(EstimatorId);
        if (!estimator) throw "No updates estimator found with given id data";
        
        return estimator;
    },

    async deleteMaterialFromProject(EstimatorId, pName, mName) {
        const estimatorsCollection = await estimators();

        const query = {
            "_id": EstimatorId,
            "projects.pName": pName,
            "projects.materials.mName": mName
        };
        await estimatorsCollection.update(query, { $pull: { 'projects.$.materials': { "mName": mName } } });

        return { "material deleted": "true" };

    }

};

module.exports = exportedMethods;
