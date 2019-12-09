if (typeof Promise !== "function" &&
    document.querySelector('details') !== null) {
  const script = '<script src="/js/details-element-polyfill.js"><\/script>'
  document.write(script) // lgtm[js/eval-like-call]
}
