var express = require('express')
var router = express.Router()
let User = require('../modals/user')
let Podcast = require('../modals/podcast')
let auth = require('../middelware/auth')

/* GET home page. */
router.get('/', auth.isUserloged, function (req, res, next) {
  let id = req.session.userId
  User.findById(id, (err, user) => {
    if (err) return next(err)
    if (user.admin) {
      Podcast.find({ id }, (err, allpodcast) => {
        if (err) return next(err)
        return res.render('admin', { allpodcast })
      })
    } else {
      if (user.subscription == 'free') {
        Podcast.find({ plane: 'free' }, (err, podcasts) => {
          if (err) return next(err)
          Podcast.find({ plane: 'free' }).distinct('artist', (err, artist) => {
            return res.render('index', { podcasts, artist })
          })
        })
      }

      // vip
      if (user.subscription == 'vip') {
        Podcast.find({ plane: 'free' }, (err, podcastF) => {
          if (err) return next(err)
          Podcast.find({ plane: 'vip' }, (err, podcastV) => {
            if (err) return next(err)
            let podcasts = podcastF.concat(podcastV)
            Podcast.find({ plane: 'free' }).distinct(
              'artist',
              (err, artistF) => {
                Podcast.find({ plane: 'vip' }).distinct(
                  'artist',
                  (err, artistV) => {
                    let artist = artistF.concat(artistV)
                    return res.render('index', { podcasts, artist })
                  },
                )
              },
            )
          })
        })
      }
      // primum

      if (user.subscription == 'Primium') {
        Podcast.find({ plane: 'free' }, (err, podcastF) => {
          if (err) return next(err)

          Podcast.find({ plane: 'vip' }, (err, podcastV) => {
            if (err) return next(err)

            Podcast.find({ plane: 'Primium' }, (err, podcastP) => {
              if (err) return next(err)
              let podcasts = [...podcastF, ...podcastV, ...podcastP]
              // distinct artist
              Podcast.find({ plane: 'free' }).distinct(
                'artist',
                (err, artistF) => {
                  Podcast.find({ plane: 'vip' }).distinct(
                    'artist',
                    (err, artistV) => {
                      Podcast.find({ plane: 'Primium' }).distinct(
                        'artist',
                        (err, artistP) => {
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
    }
  })
})
module.exports = router
