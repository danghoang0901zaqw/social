class AuthControllers {
  async signIn(req, res) {
    res.json({ message: "Sign in successfully" });
  }

  async signUp(req, res) {
    res.json({ message: "Sign up successfully" });
  }
}

module.exports = new AuthControllers();
