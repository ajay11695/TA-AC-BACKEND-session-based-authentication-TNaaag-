var express = require('express');
var router = express.Router();
var articles = require('../model/article')
var comments = require('../model/comment')
var User = require('../model/User')

// edit comment
router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id
  comments.findById(id, (err, comment) => {
    if (comment.userId.includes(req.session.userId)) {
      if (err) return next(err)
      res.render('updateComment', { comment })
    } else {
      res.redirect('/articles/' + comment.bookId)
    }

  })
})

// update comment
router.post('/:id', (req, res, next) => {
  console.log(req.body)
  comments.findByIdAndUpdate(req.params.id, req.body, (err, updateComment) => {
    if (err) return next(err)
    console.log(updateComment)
    res.redirect('/articles/' + updateComment.bookId)
  })
})

// delete comment
router.get('/:id/delete', (req, res, next) => {
  comments.findById(req.params.id, (err, comment) => {
    if (comment.userId.includes(req.session.userId)) {
      comments.findByIdAndDelete(req.params.id, (err, deleteComment) => {
        if (err) return next(err)
        articles.findByIdAndUpdate(deleteComment.bookId, { $pull: { comments: deleteComment.id } }, (err, articles) => {
          if (err) return next(err)
          res.redirect('/articles/' + articles.id)
        })
      })
    }else{
      res.redirect('/articles/' + comment.bookId)
    }
  })

})

// increment likes

router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id
  comments.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, updatelikes) => {
    if (err) return next(err)
    res.redirect('/articles/' + updatelikes.bookId)
  })
})

// increment dislikes

router.get('/:id/dislikes', (req, res, next) => {
  var id = req.params.id
  comments.findByIdAndUpdate(id, { $inc: { dislikes: 1 } }, (err, updatedislikes) => {
    if (err) return next(err)
    res.redirect('/articles/' + updatedislikes.bookId)
  })

})

module.exports = router