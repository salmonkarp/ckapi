function userOrderAuthentication(req, res, next) {
  if (req.session && req.session.user === 'order') {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = userOrderAuthentication;
