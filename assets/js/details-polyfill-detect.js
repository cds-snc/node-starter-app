const needsPolyfill = () => {
  if (typeof Promise === 'function') return false
  if (document.querySelector('details') !== null) return false
  return true
}

if (needsPolyfill()) {
  document.write('<script src="/js/details-element-polyfill.js"><\/script>')
}
