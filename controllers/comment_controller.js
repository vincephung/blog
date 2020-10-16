const Comment = require('../models/comment');
const { validationResult,body } = require('express-validator');
const moment = require('moment')

//Handle GET request for all comments
exports.get_all_comments = function (req, res) {
    console.log(req.params.id);
    Comment.find({post:req.params.id}).then((comments) => {
      if (!comments) {
        res.send('failed');
      }
      res.status(200).json(comments);
    });
  };
  
  //handle GET request for a single commnets
  exports.get_comment = function (req, res) {
    Comment.findById(req.params.commentId).then((comment) => {
      if (!comment) {
        res.json({ error: 'Comment does not exist.' });
        return;
      }
      res.status(200).json(comment);
    });
  };

  //handle Comment for creating a new comment
  exports.create_comment = [
    body('author').trim().escape().isLength({min:5}).withMessage('Comment must have an author.'),
    body('content').trim().escape().isLength({min:5}).withMessage('Comment must have text.'),
    
    (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      //if there are errors, 
      res.status(400).json(errors.errors);
      return;
    }
    const newComment = new Comment({
      author:req.body.author,
      content:req.body.content,
      timestamp: moment().format('MMMM Do[,] YYYY'),
      post:req.params.id,
    })
    newComment.save().then((comment)=>{
      res.json(comment);
    })
    .catch((err)=>{
      return next(err);
    })
  }
  ]
  
  //PUT method to update comments
  exports.update_comment = [
    body('content').trim().escape().isLength({min:5}).withMessage('Comment must have text.'),
    
    (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      //if there are errors, 
      res.status(400).json(errors.errors);
      return;
    }
    const updatedComment = {
      content:req.body.content,
    }
    Comment.findByIdAndUpdate(req.params.commentId,updatedComment,{new: true}).then((updated)=>{
      res.status(200).json({message: 'Comment Updated',updated});
    }).catch((err)=>{
      return next(err);
    })
  }
  ];

  //delete a comment
  exports.delete_comment = function(req,res,next){
    Comment.findByIdAndDelete(req.params.commentId,(err,doc)=>{
      if(err){return next(err)};
      res.status(200).json({message: 'Comment Deleted'});
    });
  };
  
  

