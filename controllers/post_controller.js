const Post = require('../models/post');
const { validationResult,body } = require('express-validator');
const moment = require('moment')

//Handle GET request for all posts
exports.get_all_posts = function (req, res) {
  Post.find({}).then((posts) => {
    if (!posts) {
      res.send('failed');
    }
    //return res.send('Successfully sent post');
    res.status(200).json(posts);
  });
};

//handle GET request for a single post
exports.get_post = function (req, res) {
  Post.findById(req.params.id).then((post) => {
    if (!post) {
      res.json({ error: 'Post does not exist.' });
      return;
    }
    res.status(200).json(post);
  });
};

/*
exports.create_post_form = function(req,res){
  res.redirect('/api/posts/new');
}
*/

//handle POST for creating a new post
exports.create_post = [
  body('title').trim().escape().isLength({min:5}).withMessage('Post must have a title.'),
  body('content').trim().escape().isLength({min:5}).withMessage('Post must have text.'),
  body('published').not().isEmpty().trim().escape().withMessage( 'Published status is required'),
  
  (req,res,next) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    //if there are errors, 
    res.status(400).json(errors.errors);
    return;
  }
  const post = new Post({
    title:req.body.title,
    content:req.body.content,
    published:req.body.published,
    timestamp: moment().format('MMMM Do[,] YYYY'),
    image:req.body.image
  })
  post.save().then((post)=>{
    res.json(post);
  })
  .catch((err)=>{
    return next(err);
  })
}
]

exports.update_post = [
  body('title').trim().escape().isLength({min:5}).withMessage('Post must have a title.'),
  body('content').trim().escape().isLength({min:5}).withMessage('Post must have text.'),
  body('published').not().isEmpty().trim().escape().withMessage( 'Published status is required'),
  
  (req,res,next) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    //if there are errors, 
    res.status(400).json(errors.errors);
    return;
  }
  const updatedPost = {
    title:req.body.title,
    content:req.body.content,
    published:req.body.published,
    lastUpdate: moment().format('MMMM Do[,] YYYY'),
    image:req.body.image,
  }
  Post.findByIdAndUpdate(req.params.id,updatedPost,{new: true}).then((updated)=>{
    res.status(200).json({message: 'Post Updated',updated});
  }).catch((err)=>{
    return next(err);
  })
}
];

//Update the published status of a post
exports.publish_status =  [
  body('published').not().isEmpty().trim().escape().withMessage( 'Published status is required'),

  (req,res,next) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    //if there are errors, 
    res.status(400).json(errors.errors);
    return;
  }
  const updatedPost = {
    published:req.body.published,
  }
  Post.findByIdAndUpdate(req.params.id,updatedPost,{new: true}).then((updated)=>{
    res.status(200).json({message: 'Post Published',updated});
  }).catch((err)=>{
    return next(err);
  })
  }
];

//delete a post
exports.delete_post = function(req,res,next){
  console.log(req.params);
  Post.findByIdAndDelete(req.params.id,(err,doc)=>{
    if(err){return next(err)};
    res.status(200).json({message: 'Post Deleted'});
  });
};

