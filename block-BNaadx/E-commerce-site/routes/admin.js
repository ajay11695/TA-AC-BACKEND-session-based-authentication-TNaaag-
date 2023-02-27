var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require('fs')

var Product = require('../model/Product')
var User = require('../model/User')

//Configuration for Multer
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {

    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage })

/* GET product listing. */
router.get('/', (req, res, next) => {
  console.log(req.session)
  if (req.session.userId) {
    Product.find({}, req.body, (err, products) => {
      User.findById({ _id: req.session.userId }, (err, user) => {
        if (err) return next()
        if(user.email== 'ajayrajput9554@gmail.com'){
          return res.render('listProduct.ejs', { products, user })
        }
        res.redirect('/users')
      })
    })
  } else {
    Product.find({}, req.body, (err, products) => {
      if (err) return next()
      res.render('dashboard.ejs', { products: products, user: undefined })
    })
  }
})

// created product form

router.get('/new', (req, res, next) => {
  User.findById({ _id: req.session.userId }, (err, user) => {
    if (err) return next(err)
    return res.render('createProduct', { user })
  })
})

// created Product

router.post('/', upload.single('image'), (req, res, next) => {
  req.body.image = req.file.filename
  req.body.userId = req.session.userId
  Product.create(req.body, (err, createProduct) => {
    if (err) return next()
    res.redirect('/admin')
    console.log(createProduct)
  })
})

// search produch
router.get('/:id', (req, res, next) => {
  var id = req.params.id
  if (req.session.userId) {
    Product.findById(id, (err, product) => {
      User.findById({ _id: req.session.userId }, (err, user) => {
        if (err) return next(err)
        res.render('AdminProduct', { product, user })
      })
    })
  } 

})


// edit product

router.get('/:id/edit', (req, res, next) => {
  Product.findById(req.params.id, (err, product) => {
    User.findById({ _id: req.session.userId }, (err, user) => {
      if (err) return next(err)
      return res.render('updateProduct', { product, user })
    })
  })

})

// update article

router.post('/:id', upload.single('image'), (req, res, next) => {
  var id = req.params.id
  let file = req.file
  let prev_Image = req.body.image

  let new_image = ''

  if (file) {
    new_image = req.file.filename;
    try {

      //delete th old img
      fs.unlinkSync('./public/images/' + prev_Image)
    } catch (error) {
      console.log(error)
    }
  } else {
    new_image = prev_Image
  }
  req.body.image = new_image

  Product.findByIdAndUpdate(id, req.body, (err, ubook) => {
    if (err) return next(err)
    res.redirect('/admin/' + id)
  })
})

// delete product

router.get('/:id/delete', (req, res, next) => {
  Product.findByIdAndDelete(req.params.id, (err, Dproduct) => {
    if (Dproduct.image !== '') {
      try {
        fs.unlinkSync('./public/images/' + Dproduct.image)
      } catch (error) {
        console.log(error)
      }
    } else {
      return res.redirect('/admin')
    }
    if (err) return next(err)
    res.redirect('/admin')
  })
})






module.exports = router;
