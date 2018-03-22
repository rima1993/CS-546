const signupRoutes = require("./signup");
const vendorRoutes = require("./vendor");
const profileRoutes = require("./profile");
const projectInfoRoutes = require("./projectInfo");
const projectListsRoutes = require("./projectLists");
const estimatorRoutes = require("./estimator");
const constructorMethod = (app) => {
    app.use("/profile",profileRoutes);
    app.use("/estimator",estimatorRoutes);
    app.use("/projectInfo",projectInfoRoutes);
    app.use("/projectLists",projectListsRoutes);
    app.use("/signup", signupRoutes);
    //app.use("/", userRoutes);
    app.use("/vendor", vendorRoutes);
    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;