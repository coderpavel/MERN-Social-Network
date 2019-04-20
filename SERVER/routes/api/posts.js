const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

const validatePostInput = require('../../validation/post');

// @route Get api/posts
// @desc GET posts
// @access Public
router.get('/', (req, res) => {
    Post
        .find()
        .sort({ date: -1 })
        .populate('users', ['name'])
        .then(posts => {
            res.json(posts);
        })
        .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
})

// @route Get api/posts/:id
// @desc GET posts by id
// @access Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .sort({ date: -1 })
        .then(posts => {
            res.json(posts);
        })
        .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
})

// @route DELETE api/post/:id
// @desc DELETE post
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notauthorized: 'User not authorized' });
                    }

                    post.remove().then(() => res.json({ success: true }));
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post not found' }));
        });
});

// @route POST api/like/:id
// @desc Like post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyliked: 'User already liked this post' });
                    }

                    // Add User id to like array
                    post.likes.unshift({
                        user: req.user.id
                    });

                    post.save().then(post => res.json(post));

                })
                .catch(err => { res.status(404).json({ postnotfound: 'No post found' }) });
        });
});

// @route POST api/unlike/:id
// @desc Unlike post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() !== req.user.id).length > 0) {
                        res.status(400).json({ alreadyliked: 'User has not liked the post' });
                    }
                    const removeIndex = post.likes
                        .map(item => item.user.toString).indexOf(req.user.id);

                    post.likes.splice(removeIndex, 1);

                    post.save().then(post => res.json(post));

                })
                .catch(err => { res.status(404).json({ postnotfound: 'No post found' }) });
        });
});

// @route Post api/posts/comment/:id
// @desc Add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);    
    }
    
    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            // Add to comments array
            post.comments.unshift(newComment);
            post.save()
                .then(post => res.json(post))
                .catch(err => res.status(404).json({ postnotfound: 'Post not found' }));
        });
});

// @route DELETE api/post/comment/:id/:comment_id
// @desc DELETE comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
   Post.findById(req.params.id)
        .then(post => {
            // Check to see  if the comment exists
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ nocomment: 'Comment does not exist'});
            } 

            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);

            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
        });
        
});

// @route Post api/posts
// @desc Create Post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

module.exports = router;