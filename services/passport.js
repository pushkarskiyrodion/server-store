import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import { ModelClass as User } from '../models/user.js';
import config from '../config.js';

const localOptions = {
  usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'User not found' })
    }

    user.comparePasswords(password, (err, isMatch) => {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' })
      }

      done(null, user)
    })

  } catch (error) {
    done(error, false)
  }
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
}

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  } catch (error) {
    done(error, false)
  }
})

passport.use(localLogin);
passport.use(jwtLogin);

export default passport;