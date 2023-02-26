var express = require('express');
var router = express.Router();
var articles = require('../model/article')
var comments = require('../model/comment')
var User = require('../model/User')

/* GET article listing. */
router.get('/', (req, res, next) => {
  console.log(req.session.userId)
  if (req.session.userId == undefined) {
    articles.find({}, req.body, (err, articles) => {
      if (err) return next(err)
      return res.render('listArticle.ejs', { articles: articles, user: undefined })
    })
  } else {
    articles.find({}, req.body, (err, articles) => {
      if (err) return next(err)
      User.findById({ _id: req.session.userId }, (err, user) => {
        if (err) return next(err)
        res.render('listArticle.ejs', { articles, user })
      })
    })
  }
})

// created article form

router.get('/new', (req, res) => {
  if (req.session.userId) {
    return res.render('createArticle')
  } else {
    res.redirect('/users/registration')
  }
})

// created article

router.post('/', (req, res, next) => {
  console.log(req.body)
  req.body.tags = req.body.tags.trim().split(' ')
  articles.create(req.body, (err, createArticle) => {
    if (err) return next()
    console.log(createArticle)
    articles.findByIdAndUpdate({ _id: createArticle._id }, { $push: { userId: req.session.userId } }, (err, Article) => {
      User.findOneAndUpdate({ userId: req.session.userId }, { $push: { articleId: createArticle._id } }, (err, updateuser) => {
        res.redirect('/articles')
        console.log(Article)

      })
    })
  })
})

// fetching single article

router.get('/:id', (req, res, next) => {
  var id = req.params.id
  if(req.session.userId == undefined){
    articles.findById(id).populate('comments').exec((err, articleDetail) => {
     return  res.render('articleDetail', { articleDetail: articleDetail ,user:undefined})
    })
  }else{
    articles.findById(id).populate('comments').exec((err, articleDetail) => {
      User.findById({ _id: req.session.userId }, (err, user) => {
        if (err) return next(err)
        res.render('articleDetail', { articleDetail: articleDetail ,user:user})
      })
    })
  }
})

// edit article

router.get('/:id/edit', (req, res, next) => {

  articles.findById(req.params.id, (err, article) => {
    if (article.userId.includes(req.session.userId)) {
      article.tags = article.tags.join(' ')
      res.render('updateArticle', { article })
    } else {
      res.redirect('/articles/' + req.params.id)
    }

  })

})

// update article

router.post('/:id', (req, res, next) => {
  var id = req.params.id
  req.body.tags = req.body.tags.trim().split(' ')
  articles.findByIdAndUpdate(id, req.body, { new: true }, (err, update) => {
    if (err) return next(err)
    res.redirect('/articles/' + id)
  })
})

// delete article

router.get('/:id/delete', (req, res, next) => {
  articles.findById(req.params.id, (err, article) => {
    if (article.userId.includes(req.session.userId)) {
      articles.findByIdAndDelete(req.params.id, req.body, (err, article) => {
        comments.deleteMany({ bookId: article.id }, (err, deleteAllcomment) => {
          if (err) return next(err)
          res.redirect('/articles')
        })
      })
    } else {
      res.redirect('/articles/' + req.params.id)
    }

  })
})

// increment likes

router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id
  articles.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, updatelikes) => {
    if (err) return next(err)
    res.redirect('/articles/' + id)
  })
})

// increment dislikes

router.get('/:id/dislikes', (req, res, next) => {
  var id = req.params.id
  articles.findById(id, (err, article) => {
    articles.findByIdAndUpdate(id, { $inc: { dislikes: 1 } }, (err, updatedislikes) => {
      if (err) return next(err)
      res.redirect('/articles/' + id)
    })
  })

})

// add comment
router.post('/:id/comments', (req, res, next) => {
  var id = req.params.id
  req.body.bookId = id
  comments.create(req.body, (err, comment) => {
    console.log(comment)
    articles.findByIdAndUpdate(id, { $push: { comments: comment } }, (err, article) => {
      comments.findByIdAndUpdate({ _id: comment._id }, { $push: { userId: req.session.userId } }, (err, comment) => {
        User.findOneAndUpdate({ userId: req.session.userId }, { $push: { commentId: comment._id } }, (err, updateuser) => {

          res.redirect('/articles/' + id)

        })
      })
    })
  })
})

module.exports = router;
