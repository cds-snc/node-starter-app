
// generic show hide toggle 
// show or hide a div (more form fields) when clicked etc... 

const toggleArea = event => {
  // ideally this won't be based on the index but....
  // we need to adjust the radio macro so we can set attributes
  // for individual inputs
  // current { 'on':'Yes','off':'No'}
  // - future {attributes : {data-something: "something"}, values: { '1':'Yes','2':'No'}}
  const toggleState = event.target.getAttribute('data-index')
  const name = event.target.name

  // look for an element with that name of the target + -toggled
  // i.e. div you want to show or hide
  const target = document.querySelector(`.${name}-toggled`)

  if (!target) return

  if (toggleState === 'on') {
    target.style.display = 'block'
  } else {
    target.style.display = 'none'
  }
}

// add an event listener for all inputs within a toggle area
const toggles = document.querySelectorAll('.toggle-area input')

toggles.forEach(el => {
  el.addEventListener('click', toggleArea)
})
