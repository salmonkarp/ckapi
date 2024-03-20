function userInvoiceAuthentication(req, res, next) {
    if (req.session && req.session.user === 'invoice') {
      next();
    } else {
      res.redirect("/login");
    }
  }
  
  module.exports = userInvoiceAuthentication;
  