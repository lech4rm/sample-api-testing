function response() {
  const methods = {
    success: (res, status, data = null, message = 'success') => {
      return res.status(status).json({
        status,
        message,
        data
      })
    },
    fail: (res, status, error = null) => {
      const errors = {
        400: 'Invalid Input',
        500: 'Internal server error',
        403: 'Forbidden',
        401: 'UnAuthorized Access'
      }
      message = errors[status]
      return res.status(status).json({
        status,
        message,
        error
      })
    }
  }

  return Object.freeze(methods)
}

module.exports = response()
