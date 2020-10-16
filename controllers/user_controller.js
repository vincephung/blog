const User = require('../models/user');
const { validationResult,body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//user logs in
exports.log_in = [
    body('username').trim().isLength({min:1}).withMessage('Must enter username'),
    body('password').trim().isLength({min:1}).withMessage('Must enter password'),
    
    function(req,res,next){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({errors:errors.errors});
        }
        User.findOne({username : req.body.username},(err,user)=>{
            if(err){return next(err)}
            if(!user){return res.status(401).json({message: 'No such user found'})};

            bcrypt.compare(req.body.password,user.password,(err,success)=>{
                //if successfully enter password,
                if(success){
                    const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET,{
                        expiresIn: '2 days',
                    });
                    return res.status(200).json({
                        message: 'User successfully signed in',
                        token,
                        username: user.username,
                        admin: user.admin,
                    })
                }else{
                    return res.status(401).json({message: "Incorrect password"});
                }
            })
        })
    }
]

exports.sign_up = function(req,res,next){
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        // if err, do something
        if(err){
            return next(err);
        }
        // otherwise, store hashedPassword in DB
        var newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            admin: req.body.admin,
        });
        newUser.save().then((user)=>{
            res.status(200).json({message: 'Created new user',user});
        }).catch((err)=>{
            return next(err);
        })
      });
}