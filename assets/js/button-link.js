// allow for certain links to be activated by pressing the space bar,
// for keyboard-navigating users.
//
// we are using a single global listener because button-link elements
// may be added and removed from the DOM dynamically.
document.addEventListener('keydown', (e) => {
  // check when we press the spacebar on a button-link element
  if (e.keyCode !== 32) return
  if (!e.target.classList.contains('button-link')) return

  // trigger the click handlers instead of entering a space
  e.preventDefault()
  e.target.click()
  return false
})
