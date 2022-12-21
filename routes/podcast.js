let express = require('express')
const { findByIdAndDelete } = require('../modals/podcast')
var router = express.Router()
let User = require('../modals/user')

let multer = require('multer')

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

let Podcast = require('../modals/podcast')
const podcast = require('../modals/podcast')

// edit podcast
router.get('/:id/edit', (req, res, next) => {
  let podcastId = req.params.id
  Podcast.findById(podcastId, (err, podcast) => {
    if (err) return next(err)
    return res.render('updatepodcast', { podcast })
  })
})

// submit edit podcast
router.post(
  '/:id/edit',
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
    let podcastId = req.params.id
    Podcast.findByIdAndUpdate(
      podcastId,
      req.body,
      { new: true },
      (err, podcast) => {
        if (err) return next(err)
        return res.redirect('/')
      },
    )
  },
)

// delete podcast
router.get('/:id/delete', (req, res, next) => {
  let podcastId = req.params.id
  Podcast.findByIdAndDelete(podcastId, (err, podcast) => {
    if (err) return next(err)
    return res.redirect('/users/admin')
  })
})

// according plan filter podcast
router.get('/filter', (req, res, next) => {
  let obj = {}
  let { plane } = req.query
  if (plane) {
    obj.plane = plane
  }
  podcast.find(obj, (err, allpodcast) => {
    return res.render('admin', { allpodcast })
  })
})

// according artist filter
router.get('/artist', (req, res, next) => {
  let id = req.session.userId
  let obj = { plane: 'free' }
  let obj2 = { plane: 'vip' }
  let obj3 = { plane: 'Primium' }
  let { artist } = req.query
  if (artist) {
    obj.artist = artist
    obj2.artist = artist
    obj3.artist = artist
  }
  User.findById(id, (err, user) => {
    //   free user
    if (user.subscription == 'free') {
      Podcast.find(obj, (err, podcasts) => {
        if (err) return next(err)
        Podcast.find({ plane: 'free' }).distinct('artist', (err, artist) => {
          return res.render('index', { podcasts, artist })
        })
      })
    }
    // vip user
    if (user.subscription == 'vip') {
      Podcast.find(obj, (err, podcastF) => {
        if (err) return next(err)
        Podcast.find(obj2, (err, podcastV) => {
          if (err) return next(err)
          Podcast.find({ plane: 'free' }).distinct('artist', (err, artistF) => {
            Podcast.find({ plane: 'vip' }).distinct(
              'artist',
              (err, artistV) => {
                let podcasts = podcastF.concat(podcastV)
                let artist = artistF.concat(artistV)
                return res.render('index', { podcasts, artist })
              },
            )
          })
        })
      })
    }
    //   primium user
    if (user.subscription == 'Primium') {
      Podcast.find(obj, (err, podcastF) => {
        if (err) return next(err)
        Podcast.find(obj2, (err, podcastV) => {
          if (err) return next(err)
          Podcast.find(obj3, (err, podcastP) => {
            if (err) return next(err)
            Podcast.find({ plane: 'free' }).distinct(
              'artist',
              (err, artistF) => {
                Podcast.find({ plane: 'vip' }).distinct(
                  'artist',
                  (err, artistV) => {
                    Podcast.find({ plane: 'Primium' }).distinct(
                      'artist',
                      (err, artistP) => {
                        let podcasts = [...podcastF, ...podcastV, ...podcastP]
                        let artistall = [...artistF, ...artistV, ...artistP]
                        let artistobj = new Set(artistall)
                        let artist = Array.from(artistobj)
                        return res.render('index', { podcasts, artist })
                      },
                    )
                  },
                )
              },
            )
          })
        })
      })
    }
  })
})
module.exports = router
