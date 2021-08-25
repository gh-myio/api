const jwt = require('jsonwebtoken')

const methods = {
  isUserAdmin: (token) => (methods.getUserRole(token) === 'admin'),
  getUserData: (token) => {
    try {
      return jwt.verify(token, global.privKey)
    } catch (error) {
      return {}
    }
  },
  getUserRole: (token) => {
    const { role } = methods.getUserData(token)
    return role == null ? 'default' : role
  },
  isModified: (req, res, date) => {
    const lastModifiedDate = new Date(date)
    res.setHeader('Last-Modified', lastModifiedDate.toUTCString())
    const ifModfiedSince = new Date(req.headers['if-modified-since'])
    if (req.method === 'HEAD' || (ifModfiedSince >= lastModifiedDate.setMilliseconds(0))) {
      return false
    }
    return true
  }
}

module.exports = methods
