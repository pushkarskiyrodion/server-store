import jwt from 'jwt-simple';
import config from '../config.js';
import { ModelClass as User } from '../models/user.js';

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

export const signup = (req, res, next) => {
  const { email, password, name, surname } = req.body;

  if (!email || !password || !name || !surname) {
    return res
      .status(422)
      .send({ message: 'You must provide all required data' });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(422).send({ message: 'Email is in use' });
      }

      const user = new User({ email, password, name, surname });

      user.save()
        .then((result) => res.send({
          user: {
            email,
            name,
            surname,
          },
          token: tokenForUser(result),
        }))
        .catch((err) => next(err));
    })
    .catch((err) => {
      console.log(err);
      if (err) {
        return next(err);
      }
    });
};

export const signin = (req, res) => {
  const { name, surname, email } = req.user;
  const token = tokenForUser(req.user);
  
  res.send({ user: { name, surname, email }, token});
};
