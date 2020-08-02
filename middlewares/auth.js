const AdminModel = require('../models/admin');

module.exports.login = async function (req, res, next) {
    var { email, password } = req.body
    console.log('password: ', password);
    console.log('email: ', email);

    let admin = await AdminModel.findOne({email});

    if (admin.email == email &&
        admin.password == password) {
        if (admin.superuser) 
            req.session.type = 'superuser';
        else            
            req.session.type = 'admin';
    
            req.session._id = admin._id;
            req.session.email = admin.email;
            req.session.firstname = admin.firstname;
            req.session.lastname = admin.lastname;

            return res.json({
                status: 'success',
                msg: 'Successfully logged In',
                data: null,
                redirect: '/home'
            });

        } else {
            res.json({
                status: 'error',
                msg: 'Invalid email/password',
                data: null
            });
        }
    }

    module.exports.logout = function (req, res, next) {
        req.session.destroy();
        res.redirect('/');
    }

    module.exports.isAdmin = function (req, res, next) {
        if (req.session._id) {
            console.log(req.session._id);
            req.body.id = req.session._id;
            next();
        }
        else {
            // res.send('You are loggout');
            res.redirect('/');
        }
    }
    module.exports.isNotAdmin = function (req, res, next) {
        if (!req.session._id) {
            next();
        }
        else {
            // res.send('You are loggout');
            console.log(req.session._id);
            res.render('home');
        }
    }

