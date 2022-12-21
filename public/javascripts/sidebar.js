let filterIcon = document.querySelector('.filter-icon')
let tagform = document.querySelector('.tag-form')
tagform.classList.add('display-none')
filterIcon.addEventListener('click', () => {
  tagform.classList.toggle('display-none')
  console.log(tagdiv)
})
