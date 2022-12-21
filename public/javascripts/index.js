let visivilty = document.querySelector('.visivilty')
let password = document.querySelector('#password-input')
let playbtn = document.querySelectorAll('.play-btn')
let audioplay = document.querySelector('.audioplay')
let playpause = document.querySelector('.play-pause')
let pa = document.querySelectorAll('.pauseli')
//
// let filterIcon = document.querySelector('.filter-icon')
// let tagform = document.querySelector('.tag-form')
// tagform.classList.add('display-none')
// filterIcon.addEventListener('click', () => {
//   tagform.classList.toggle('display-none')
//   console.log(tagdiv)
// })

playbtn.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let audio = e.target.parentElement.nextSibling.nextElementSibling.src
    audioplay.src = audio
    playmusic()
    e.target.parentElement.classList.add('display-none')

    e.target.parentElement.nextSibling.nextElementSibling.nextElementSibling.classList.add(
      'display-block',
    )
  })
})

pa.forEach((elm) => {
  elm.addEventListener('click', (e) => {
    stopmusic()
    e.target.parentElement.classList.remove('display-block')
    e.target.parentElement.previousElementSibling.previousElementSibling.classList.remove(
      'display-none',
      console.log(e.target.parentElement),
    )
  })
})

function playmusic() {
  audioplay.play()
}

function stopmusic() {
  audioplay.pause()
}
// password eye
let is_show = true
visivilty.addEventListener('click', () => {
  if (is_show) {
    password.setAttribute('type', 'text')
    visivilty.innerHTML = ' visibility'
  } else {
    password.setAttribute('type', 'password')
    visivilty.innerHTML = ' visibility_off'
  }
  is_show = !is_show
})

// play music
