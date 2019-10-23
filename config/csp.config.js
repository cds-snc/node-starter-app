// docs: https://helmetjs.github.io/docs/csp/

const scriptSrc = ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com']

if (process.env.NODE_ENV === 'development') {
  scriptSrc.push("'unsafe-eval'")
}

module.exports = {
  defaultSrc: ["'self'"],
  scriptSrc,
  baseUri: ["'none'"],
  fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  imgSrc: ["'self'", 'data:'],
  styleSrc: ["'self'", 'https://fonts.googleapis.com'],
}
