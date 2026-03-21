const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const buildCallbackUrl = (path) => `${process.env.SERVER_URL || ''}${path}`;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: buildCallbackUrl('/v1/auth/oauth/google/callback'),
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, { provider: 'google', profile, accessToken, refreshToken });
      },
    ),
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: buildCallbackUrl('/v1/auth/oauth/facebook/callback'),
        profileFields: ['id', 'emails', 'name'],
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, { provider: 'facebook', profile, accessToken, refreshToken });
      },
    ),
  );
}

module.exports = passport;
