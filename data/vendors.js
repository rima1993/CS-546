const mongoCollections = require("../config/mongoCollections");
const vendors = mongoCollections.vendors;
const uuid = require("node-uuid");

const exportedMethods = {

    async getVendorById(id) {
        const vendorsCollection = await vendors();
        const vendor = await vendorsCollection.findOne({ _id: id }, { password: 0 });
        if (!vendor) throw "No Vendor found with given id data";
        return vendor;
    },

    async getVendorVerification(email) {
        const vendorsCollection = await vendors();
        const vendor = await vendorsCollection.findOne({ email: email });
        if (!vendor) throw "No Vendor found with given email";
        return { userName: vendor.userName, password: vendor.password, _id: vendor._id };
    },

    async getVendorByUserName(userName) {
        const vendorsCollection = await vendors();
        const vendor = await vendorsCollection.findOne({ userName: userName }, { password: 0 });
        if (!vendor) throw "No Vendor found with given user name";
        return vendor;
    },

    async getVendorsByZip(zip) {
        const vendorsCollection = await vendors();
        const vendorList = await vendorsCollection.find({ zip: zip }, { password: 0 }).toArray();
        if (!vendorList) throw "No Vendor found with given zip";
        return vendorList;
    },

    async getVendorsByMaterialName(name) {
        const vendorsCollection = await vendors();
        const vendorList = await vendorsCollection.find({ "materials.name": name }, { userName: 1, materials: { $elemMatch: { name: name } } }).toArray();
        if (!vendorList) throw "No Vendor found with given material name";
        var arrayToReturn = [];
        vendorList.forEach(function (element) {
            let obj = element.materials[0];
            obj.userName = element.userName;
            obj._id = element._id;
            arrayToReturn.push(obj);
        }, this);

        return arrayToReturn;

    },
    



    async createVendor(userName, firstName, lastName, phone, zip, email, password) {
        if (typeof userName != "string" || userName.length <= 0) throw "No valid User Name provided";
        if (typeof firstName != "string" || firstName.length <= 0) throw "No valid First Name provided";
        if (typeof lastName != "string" || lastName.length <= 0) throw "No valid Last Name provided";
        if (typeof phone != "string" || phone.length <= 0) throw "No valid Phone provided";
        if (typeof zip != "string" || zip.length <= 0) throw "No valid Zip provided";
        if (typeof email != "string" || email.length <= 0) throw "No valid Email provided";
        if (typeof password != "string" || password.length <= 0) throw "No valid password provided";

        materials = []


        const vendorsCollection = await vendors();
        const vendorList = await vendorsCollection.find().toArray();
        vendorList.forEach(function (element) {
            if (element.email == email) {
                throw "user exists with same email, try another"
            }
        }, this);
        vendorList.forEach(function (element) {
            if (element.userName == userName) {
                throw "user exists with same user name, try another"
            }
        }, this);

        const newVendor = {
            _id: uuid.v4(),
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            zip: zip,
            email: email,
            password: password,
            materials: materials
        };

        const newInsertInformation = await vendorsCollection.insertOne(newVendor);

        const newId = newInsertInformation.insertedId;

        var out = await this.getVendorById(newId);
        return out;
    },


    async updateVendor(id, vendorDataToUpdate) {

        const vendorsCollection = await vendors();
        const vendorToUpdate = await this.getVendorById(id);
        if (!vendorToUpdate) throw "vendor not found for update";

        let vendorReadyToUpdate = {};
        let someToUpdate = false;

        if (vendorDataToUpdate.hasOwnProperty("firstName")) {
            someToUpdate = true;
            if (typeof vendorDataToUpdate.firstName != "string" || vendorDataToUpdate.firstName.length <= 0) {
                console.log("Invalid first name");
                throw "Invalid first name";
            }
            vendorReadyToUpdate.firstName = vendorDataToUpdate.firstName;
        }

        if (vendorDataToUpdate.hasOwnProperty("lastName")) {
            someToUpdate = true;
            if (typeof vendorDataToUpdate.lastName != "string" || vendorDataToUpdate.lastName.length <= 0) {
                console.log("Invalid last name");
                throw "Invalid last name";
            }
            vendorReadyToUpdate.lastName = vendorDataToUpdate.lastName;
        }

        // if (vendorDataToUpdate.hasOwnProperty("userName")) {
        //     someToUpdate = true;
        //     if (typeof vendorDataToUpdate.userName != "userName" || vendorDataToUpdate.title.length <= 0) {
        //         console.log("Invalid user name");
        //         throw "Invalid user name";
        //     }
        //     vendorReadyToUpdate.userName = vendorDataToUpdate.userName;
        // }

        if (vendorDataToUpdate.hasOwnProperty("phone")) {
            someToUpdate = true;
            if (typeof vendorDataToUpdate.phone != "string" || vendorDataToUpdate.phone.length <= 0) {
                console.log("Invalid phone");
                throw "Invalid phone";
            }
            vendorReadyToUpdate.phone = vendorDataToUpdate.phone;
        }

        if (vendorDataToUpdate.hasOwnProperty("zip")) {
            someToUpdate = true;
            if (typeof vendorDataToUpdate.zip != "string" || vendorDataToUpdate.zip.length <= 0) {
                console.log("Invalid zip");
                throw "Invalid zip";
            }
            vendorReadyToUpdate.zip = vendorDataToUpdate.zip;
        }

        // if (vendorDataToUpdate.hasOwnProperty("email")) {
        //     someToUpdate = true;
        //     if (typeof vendorDataToUpdate.email != "string" || vendorDataToUpdate.email.length <= 0) {
        //         console.log("Invalid email");
        //         throw "Invalid email";
        //     }
        //     vendorReadyToUpdate.email = vendorDataToUpdate.email;
        // }

        if (vendorDataToUpdate.hasOwnProperty("password")) {
            someToUpdate = true;
            if (typeof vendorDataToUpdate.password != "string" || vendorDataToUpdate.password.length <= 0) {
                console.log("Invalid password");
                throw "Invalid password";
            }
            vendorReadyToUpdate.password = vendorDataToUpdate.password;
        }

        if (!someToUpdate) {
            throw "nothing to update";
        }

        let updateCommand = {
            $set: vendorReadyToUpdate
        };

        const query = {
            _id: id
        };

        await vendorsCollection.updateOne(query, updateCommand);

        const vendor = await this.getVendorById(id);
        if (!vendor) throw "No updates vendor found with given id data"

        return vendor;
    },

    async addMaterial(vendorId, name, description, unitCost, inStock, discount, discountQty) {

        if (typeof name != "string" || name.length <= 0) throw "No valid name provided";
        if (typeof description != "string" || description.length <= 0) throw "No valid material description provided";
        if (typeof unitCost != "string" || unitCost.length <= 0) throw "No valid unitCost provided";
        if (typeof inStock != "string" || inStock.length <= 0) throw "No valid inStock provided";
        if (typeof discount != "string" || discount.length <= 0) throw "No valid discount provided";
        if (typeof discountQty != "string" || discountQty.length <= 0) throw "No valid discount quantity provided";

        const vendorsCollection = await vendors();

        const v1 = await this.getVendorById(vendorId);

        v1.materials.forEach(function (element) {
            if (element.name == name) {
                throw "material exists, try updating"
            }
        }, this);


        const newMaterial = {
            name: name,
            description: description,
            unitCost: unitCost,
            inStock: inStock,
            discount: discount,
            discountQty: discountQty
        };

        await vendorsCollection.update({ _id: vendorId }, { $push: { materials: newMaterial } });

        return newMaterial;
    },

    async updateMaterial(VendorId, name, materialDataToUpdate) {

        const vendorsCollection = await vendors();

        const vendorToUpdate = await this.getVendorById(VendorId);
        if (!vendorToUpdate) throw "vendor not found for update";

        let materialReadyToUpdate = {};
        let someToUpdate = false;

        // if (materialDataToUpdate.hasOwnProperty("name")) {
        //     someToUpdate = true;
        //     if (typeof materialDataToUpdate.name != "string" || materialDataToUpdate.name.length <= 0) {
        //         throw "Invalid name";
        //     }
        //     materialReadyToUpdate['materials.$.name'] = materialDataToUpdate.name;
        // }

        if (materialDataToUpdate.hasOwnProperty("description")) {
            someToUpdate = true;
            if (typeof materialDataToUpdate.description != "string" || materialDataToUpdate.description.length <= 0) {
                throw "Invalid description";
            }
            materialReadyToUpdate['materials.$.description'] = materialDataToUpdate.description;
        }

        if (materialDataToUpdate.hasOwnProperty("unitCost")) {
            someToUpdate = true;
            if (typeof materialDataToUpdate.unitCost != "string" || materialDataToUpdate.unitCost.length <= 0) {
                throw "Invalid Unit Cost";
            }
            materialReadyToUpdate['materials.$.unitCost'] = materialDataToUpdate.unitCost;
        }

        if (materialDataToUpdate.hasOwnProperty("inStock")) {
            someToUpdate = true;
            if (typeof materialDataToUpdate.inStock != "string" || materialDataToUpdate.inStock.length <= 0) {
                throw "Invalid inStock";
            }
            materialReadyToUpdate['materials.$.inStock'] = materialDataToUpdate.inStock;
        }

        if (materialDataToUpdate.hasOwnProperty("discount")) {
            someToUpdate = true;
            if (typeof materialDataToUpdate.discount != "string" || materialDataToUpdate.discount.length <= 0) {
                throw "Invalid discount";
            }
            materialReadyToUpdate['materials.$.discount'] = materialDataToUpdate.discount;
        }

        if (materialDataToUpdate.hasOwnProperty("discountQty")) {
            someToUpdate = true;
            if (typeof materialDataToUpdate.discountQty != "string" || materialDataToUpdate.discountQty.length <= 0) {
                throw "Invalid discount quantity";
            }
            materialReadyToUpdate['materials.$.discountQty'] = materialDataToUpdate.discountQty;
        }


        if (!someToUpdate) {
            throw "nothing to update";
        }

        let updateCommand = {
            $set: materialReadyToUpdate
        };

        const query = {
            _id: VendorId,
            "materials.name": name
        };

        await vendorsCollection.updateOne(query, updateCommand);

        const vendor = await this.getVendorById(VendorId);
        if (!vendor) throw "No updates vendor found with given id data"

        return vendor;

    },

    async deleteMaterial(VendorId, name) {

        const vendorsCollection = await vendors();

        const vendorToUpdate = await this.getVendorById(VendorId);
        if (!vendorToUpdate) throw "vendor not found for update";

        await vendorsCollection.update({ _id: VendorId }, { $pull: { materials: { "name": name } } });

        return { "material deleted": "true" };

    }

};

module.exports = exportedMethods;