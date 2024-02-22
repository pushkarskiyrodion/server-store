import express from 'express';
import { signin, signup } from '../controllers/authentification.js';
import authPassport from '../services/passport.js';
import { update, changePassword, deleteAccount } from '../controllers/updateUserData.js';

export const router = new express.Router();

const requireAuth = authPassport.authenticate('jwt', { session: false })
const requireSignin = (req, res, next) => {
  authPassport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json(info);
    }

    req.user = user;
    return next();
  })(req, res, next);
}

router.post('/signup', signup);
router.post('/signin', requireSignin, signin);
router.patch('/update', requireAuth, update);
router.delete('/deleteAccount', requireAuth, deleteAccount)
router.patch('/changePassword', requireAuth, changePassword);

router.post('/support', requireAuth, (req, res) => {
  if (!req.body.message) {
    return res.status(422).send({ message: `Message can't be empty`})
  }

  console.log(req.body)

  res.status(200).send({ message: `Thank you for your message`})
});