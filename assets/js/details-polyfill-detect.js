const needsPolyfill = () => {
  if (typeof Promise === 'function') return false
  if (document.querySelector('details') !== null) return false
  return true
}

if (needsPolyfill()) {
  const script = '<script src="/js/details-element-polyfill.js"><\/script>'
  document.write(script) // lgtm[js/eval-like-call]
}
