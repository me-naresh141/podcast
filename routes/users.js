var express = require('express')
var router = express.Router()
let User = require('../modals/user')
let Podcast = require('../modals/podcast')
let multer = require('multer')
let flash = require('connect-flash')
// multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
var upload = multer({ storage: storage })

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

// find admin page
router.get('/admin', (req, res, next) => {
  let id = req.session.userId
  User.findById(id, (err, user) => {
    if (err) return next(err)
    if (user.admin == true) {
      Podcast.find({ id }, (err, allpodcast) => {
        console.log(err, allpodcast)
        if (err) return next(err)
        return res.render('admin', { allpodcast })
      })
    } else {
      return res.redirect('/')
    }
  })
})
//  find sign up form
router.get('/register', (req, res, next) => {
  return res.render('signup')
})

// find sign in form
router.get('/login', (req, res, next) => {
  let error = req.flash('error')[0]
  return res.render('signIn', { error })
})

// submit register form

router.post('/register', upload.single('profileImage'), (req, res, next) => {
  req.body.profileImage = req.file.filename
  let { email } = req.body
  User.findOne({ email }, (err, user) => {
    if (user) {
      req.flash('error', ' User already sing-up,please login ')
      return res.redirect('/users/login')
    } else {
      User.create(req.body, (err, user) => {
        if (err) return next(err)
        return res.redirect('/users/login')
      })
    }
  })
})

// submit login form
router.post('/login', (req, res, next) => {
  let { email, password } = req.body
  if (!email && !password) {
    req.flash('error', 'Email,passwword is required ')
    return res.redirect('/users/login')
  }
  User.findOne({ email }, (err, user) => {
    // no user
    if (!user) {
      if (err) return next(err)
      req.flash('error', 'Email is invalid ')
      return res.redirect('/users/login')
    }
    // password compare
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err)
      if (!result) {
        req.flash('error', 'password is invalid ')
        return res.redirect('/users/login')
      }
      // persist loged in user information
      req.session.userId = user.id
      return res.redirect('/')
    })
  })
})

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy()
  res.clearCookie('connect.sid')
  return res.redirect('/users/login')
})

// find subscription form

router.get('/subscription', (req, res, next) => {
  return res.render('subscriptionplan')
})

// create a podcast
router.post(
  '/podcast',
  upload.fields([
    {
      name: 'poster',
      maxCount: 1,
    },
    {
      name: 'audio',
      maxCount: 1,
    },
  ]),
  (req, res, next) => {
    req.body.poster = req.files.poster[0].filename
    req.body.audio = req.files.audio[0].filename
    req.body.author = req.session.userId
    Podcast.create(req.body, (err, pod) => {
      return res.redirect('/users/admin')
    })
  },
)

// select subscription
router.get('/plane', (req, res, next) => {
  return res.render('subscriptionForm')
})

//update plane

router.get('/updateplane', (req, res, next) => {
  let userId = req.session.userId
  User.findById(userId, (err, user) => {
    if (err) return next(err)
    user.subscription = req.query.plane
    User.findByIdAndUpdate(userId, user, { new: true }, (err, users) => {
      return res.redirect('/')
    })
  })
})
module.exports = router
