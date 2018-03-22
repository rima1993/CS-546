const data = require("./data");
const connection = require("./config/mongoConnection");
const util = require('util');
const bcrypt = require('bcrypt');

async function main() {


    try {

        var pw1 = await bcrypt.hash("Rima12", 10);
        var pw2 = await bcrypt.hash("Brijesh12", 10);
        var pw3 = await bcrypt.hash("Phill12", 10);

        const e1 = await data.estimators.createEstimator("Brink Construction", "Rima", "Patel", "2564582965", "12058", "rima12@stevens.edu", pw1);
        const e2 = await data.estimators.createEstimator("AABuild Production", "Brijesh", "Patel", "5512634920", "12059", "brijesh12@stevens.edu", pw2);
        const e3 = await data.estimators.createEstimator("BulKings", "Phill", "Barresi", "2564528965", "12058", "phill12@stevens.edu", pw3);

        // console.log(util.inspect(e1, false, null));
        // const e2 = await data.estimators.getEstimatorById(e1._id);
        // console.log(util.inspect(e2, false, null));
        // const e3 = await data.estimators.updateEstimator("4430725d-4f50-4427-879e-6e4148d733b3",{zip:"99"});
        const p1 = await data.estimators.addProject(e1._id, "The American Dream", "This is North America's largest shopping centre", "2017-05-12", "2 Years", "PCL Construction");
        const p2 = await data.estimators.addProject(e1._id, "Al Maktoum Airport", "World's Largest Airport planned to locate at Dubai", "2018-09-11", "3 Years", "PMY Consulting");
        const p3 = await data.estimators.addProject(e1._id, "Water Transfer Project", "Construction of 3 huge canals and arrying water to the North from China's three largest rivers", "2018-07-06", "2.5 Years", "DK Productions");

        const p4 = await data.estimators.addProject(e2._id, "Green Building", "This is India's largest Gaming centre", "2018-09-19", "2.5 Years", "VGH Construction");
        const p5 = await data.estimators.addProject(e2._id, "State Route 99 Tunnel Project ", "It's Largest Tunnel planned to locate at China", "2018-11-12", "3 Years", "Nomora");
        const p6 = await data.estimators.addProject(e2._id, "Lincoln Square Expansion", "36-acre mixed-use development with 309 apartment units, restaurant and brewery space", "2018-10-08", "2.5 Years", "Kemper Development Co.");

        const p7 = await data.estimators.addProject(e3._id, "Bridge Dream", "This is North America's largest shopping centre", "2018-03-12", "2 Years", "PCL Construction");
        const p8 = await data.estimators.addProject(e3._id, "The AMC Theater", "World's Largest Airport planned to locate at Dubai", "2018-02-12", "3 Years", "PMY Consulting");
        const p9 = await data.estimators.addProject(e3._id, "Rolfe Hall HVAC Installation", "Construction of hall HVAC", "2018-08-12", "2.5 Years", "Sound Transit");

        const m11 = await data.estimators.addMaterialToProject(e1._id, "The American Dream", "Bricks", "Merchants Construction", "Great in aesthetic, strenght and porosity", "1.2", "10", "400", "600");
        const m21 = await data.estimators.addMaterialToProject(e1._id, "The American Dream", "Bricks", "Sylist", "This is North America's largest shopping centre", "1.0", "5", "250", "500");
        const m31 = await data.estimators.addMaterialToProject(e1._id, "Al Maktoum Airport", "Plywood", "Merchants Construction", "Good workability to ease laying work", "3.5", "25", "600", "788");
        const m41 = await data.estimators.addMaterialToProject(e1._id, "Water Transfer Project", "Concrete", "Sylist", "Hign in strenght, durability, versality and economy", "1.1", "7", "300", "660");
        const m12 = await data.estimators.addMaterialToProject(e2._id, "Green Building", "Sand", "Merchants Construction", "TFine Sand(0.075 to 0.425 mm), Medium Sand(0.425 to 2 mm)", "3", "10", "400", "1000");
        const m22 = await data.estimators.addMaterialToProject(e2._id, "Green Building", "Mortar", "BuildDraw", "High quality", "1.2", "10", "400", "900");
        const m32 = await data.estimators.addMaterialToProject(e2._id, "Lincoln Square Expansion", "Mortar", "BuildDraw", "High quality", "1.2", "10", "400", "900");
        const m42 = await data.estimators.addMaterialToProject(e2._id, "State Route 99 Tunnel Project", "Stone", "Sylist", "High in durability, quality, appearance, economy", "0.7", "0", "0", "900");
        const m13 = await data.estimators.addMaterialToProject(e3._id, "The AMC Theater", "Sand", "Merchants Construction", "TFine Sand(0.075 to 0.425 mm), Medium Sand(0.425 to 2 mm)", "3", "10", "400", "1000");
        const m23 = await data.estimators.addMaterialToProject(e3._id, "Bridge Dream", "Mortar", "BuildDraw", "High quality", "1.2", "10", "400", "1000");
        const m33 = await data.estimators.addMaterialToProject(e3._id, "Bridge Dream", "Aggregate", "BuildDraw", "High quality", "4.0", "10", "600", "1001");
        const m43 = await data.estimators.addMaterialToProject(e3._id, "Bridge Dream", "Timber", "BuildDraw", "Used in floorings, roofing etc.", "1.2", "10", "400", "1150");

        // const m14 = await data.estimators.getEstimatorById(e1._id);
        // console.log(util.inspect(m14, false, null));
        var pw4 = await bcrypt.hash("Charmi12", 10);
        var pw5 = await bcrypt.hash("Megh12", 10);
        var pw6 = await bcrypt.hash("Maulik12", 10);
        const v1 = await data.vendors.createVendor("Sylist", "Charmi", "Bhikadiya", "5512635896", "07307", "cbhikadi@stevens.edu", pw4);
        const v2 = await data.vendors.createVendor("Merchants Construction", "megh", "patel", "5814635896", "07389", "megh12@stevens.edu", pw5);
        const v3 = await data.vendors.createVendor("BuildDraw", "Maulik", "Jalal", "1515635895", "07256", "maulik12@stevens.edu", pw6);

        const m1 = await data.vendors.addMaterial(v1._id, "Stone", "High in durability, quality, appearance, economy", "0.7", "10560", "0", "0");
        const m2 = await data.vendors.addMaterial(v1._id, "Bricks", "Great in aesthetic, strenght and porosity ", "1.0", "12000", "5", "250");
        const m3 = await data.vendors.addMaterial(v1._id, "Concrete", "Hign in strenght, durability, versality and economy", "1.1", "11400", "7", "300");

        const m4 = await data.vendors.addMaterial(v2._id, "Bricks", "Great in aesthetic, strenght and porosity", "1.2", "18500", "10", "400");
        const m5 = await data.vendors.addMaterial(v2._id, "Plywood", "Good workability to ease laying work", "3.5", "45980", "25", "600");
        const m6 = await data.vendors.addMaterial(v2._id, "Sand", "Fine Sand(0.075 to 0.425 mm), Medium Sand(0.425 to 2 mm)", "3", "80500", "10", "400");

        const m7 = await data.vendors.addMaterial(v3._id, "Mortar", "High quality", "1.2", "18500", "10", "400");
        const m8 = await data.vendors.addMaterial(v3._id, "Timber", "Used in floorings, roofing etc.", "1.2", "78500", "10", "400");
        const m9 = await data.vendors.addMaterial(v3._id, "Aggregate", "Chamically inactive, strong", "4", "12500", "5", "600");

        // const a = await data.vendors.getVendorsByMaterialName("Bricks");
        // console.log(util.inspect(a, false, null));
        //console.log(util.inspect(m9, false, null));

        //  const e7 = await data.estimators.getProjectByName("8d2d43c1-eae2-414d-a982-2c52e0dcbb76","The American Dream")
        //  console.log(util.inspect(e7, false, null));

        //     const mm2 = await data.estimators.getEstimatorById(e1._id);
        //     console.log(util.inspect(mm2, false, null));
        // const de1 = await data.estimators.deleteMaterialFromProject(e1._id, "The American Dream","bricks","abc");
        //     const mm3 = await data.estimators.getEstimatorById(e1._id);
        //     console.log(util.inspect(mm3, false, null));

        
        console.log("data added to db successfully");


    } catch (e) {
        console.log(e);
    }

    const db = await connection();
    await db.close();
}

try {
    main();
} catch (error) {
    console.error(error);
}