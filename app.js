const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require('express-session');
const exphbs = require('express-handlebars');
// const flash = require('connect-flash');
const passport = require('passport');
const configRoutes = require("./routes");
const Strategy = require('passport-local').Strategy;
const app = express();
const static = express.static(__dirname + '/public');
const Handlebars = require('handlebars');
const data = require('./data');
const bcrypt = require('bcrypt');
var user_type = '';
var helpers = require('handlebars-helpers')({
    handlebars: helpers
});
// app.use(flash());
const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

            return new Handlebars.SafeString(JSON.stringify(obj));
        }
    }
});




passport.use(new Strategy(
    async function (username, password, done) {
        try {
            let user;
            if (user_type == 'Vendor') {
                user = await data.vendors.getVendorVerification(username);
            }
            else {
                user = await data.estimators.getEstimatorVerification(username);
            }
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    user.type = user_type;
                    delete user.password; //removing password before storing user details for next page
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Wrong Password' });
                }
            }
            else {
                return done(null, false, { message: 'User not found' });
            }
        } catch (err) {
            return done(null, false, { message: err });
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});



app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');
app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',
    function (req, res) {
        if (req.user) {
            if (req.user.type == 'Vendor') {
                res.redirect('/vendor');
            } else {
                res.redirect('/projectLists');
            }

        }
        else {
            req.session.error ? res.render('./Login', { message: req.session.error }) : res.render('./Login', {});
        }
    });

// app.get('/profile',async function (req, res) {
//     if (req.user) {
//         let a1 = {}
//         let typeVal ={}
//         if (req.user.type == 'Vendor') {
//             typeVal = {profile:'Vendor'}
//             a1 = await data.vendors.getVendorById(req.user._id);
//         } else {
//             typeVal = {profile:'Estimator'}
//             a1 = await data.estimators.getEstimatorById(req.user._id);
//         }
//         let obj1 = { FN:a1.firstName, LN:a1.lastName, ZP:a1.zip, PH:a1.phone, EM:a1.email, PD:a1.password};
//         res.render("./Profile", {obj:obj1, type:typeVal});

//     }else{
//         res.redirect('/');
//     }

// });

app.get('/logout', function (req, res) {
    req.logout();
    req.session.user = null;
    req.session.projectName = null;
    res.redirect('/');
});



app.post('/login', function (req, res, next) {
    user_type = req.body.User_type;
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            req.session.error = info.message;
            return res.redirect('/');
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            req.session.error = null
            return res.redirect('/');
        });
    })(req, res, next);
});



app.get('/vendor', async function (req, res) {
    if (req.user) {
        if (req.user.type == 'Vendor') {
            const user1 = await data.vendors.getVendorById(req.user._id);
            res.render('./Vendor', { user: user1 })
        } else {
            res.redirect('/');
        }
    } else {
        req.session.error = "Please Log In First";
        return res.redirect('/')
    }

});

app.get('/estimator', async function (req, res) {

    if (req.user) {
        if (req.user.type == 'Estimator') {
            if (req.session.projectName) {

                let prjName = req.session.projectName;
                // req.session.projectName = null;
                const userInfo = await data.estimators.getEstimatorById(req.user._id);
                const user1 = await data.estimators.getProjectByName(req.user._id, prjName);

                res.render('./Estimator', { user: user1,userI:userInfo });
            }
            else{
                res.redirect("/")
            }

        }
        else {
            res.redirect("/");
        }
    } else {
        req.session.error = "Please Log In First";
        return res.redirect('/')
    }

});

// app.get('/projectLists', async function (req, res) {
//     if(req.user){
//         // const estimator = await data.estimators.getEstimatorById(req.user._id);
//         // let estimatorProjects = [];
//         // estimator.projects.forEach(function (element) {
//         //     let obj = {PN:element.pName};
//         //     estimatorProjects.push(obj);
//         // }, this);


//         // req.user.type == 'Estimator' ? res.render('./ProjectLists', {myProjectsList:estimatorProjects}) : res.redirect('/');
//     }else{
//         req.session.error = "Please Log In First";
//         return res.redirect('/')
//     }
// });

// app.post('/projectLists', function (req, res, next) {
//     console.log(req.body);
// });



app.get('/signup', function (req, res, next) {
    res.render("Signup", {});
});

app.post('/signup', function (req, res, next) {
    next();
});

app.post('*', function (req, res, next) {
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});