var express = require('express');
var router = express.Router();
var post_controller = require('../controllers/post_controller');
var comment_controller = require('../controllers/comment_controller');
var user_controller = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

//GET all posts
router.get('/api/posts', post_controller.get_all_posts);

//GET single post
router.get('/api/posts/:id', post_controller.get_post);

//GET request to show form to make new post
//router.get('/api/posts/new',post_controller.create_post_form);

//POST request to create a new post
router.post('/api/posts',post_controller.create_post)

//PUT request to update a post
router.put('/api/posts/:id',post_controller.update_post);

//PUT request to update the published status of a post
router.put('/api/posts/:id/publish',post_controller.publish_status);

//DELETE request to delete a post
router.delete('/api/posts/:id',post_controller.delete_post);

// comment routes

//GET all comments
router.get('/api/posts/:id/comments', comment_controller.get_all_comments);

//GET single comment
router.get('/api/posts/:id/comments/:commentId', comment_controller.get_comment);


//POST request to create a new comment
router.post('/api/posts/:id/comments',comment_controller.create_comment)


//PUT request to update a comment
router.put('/api/posts/:id/comments/:commentId',comment_controller.update_comment);

//DELETE request to delete a comment
router.delete('/api/posts/:id/comments/:commentId',comment_controller.delete_comment);

//user routes 

//POST method to users to sign up
router.post('/api/sign-up',user_controller.sign_up);

//POST method to login user
router.post('/api/log-in', user_controller.log_in);

//POST method for user to sign out
//router.post('/api/sign-out', user_controller.sign_out);




module.exports = router;
