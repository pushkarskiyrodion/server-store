import { ModelClass as User } from '../models/user.js';

export const update = async (req, res, next) => {
  const { name: newName, surname: newSurname, email } = req.body;

  if (!newName.trim() || !newSurname.trim() || !email.trim()) {
    return res.status(422).send({ message: 'You must provide all required data' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (existingUser.name === newName && existingUser.surname === newSurname) {
      return res.status(422).send({ message: 'Data is already up to date' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { name: newName, surname: newSurname }},
      { new: true }
    );

    res.status(200).send({
      user: { name: updatedUser.name, surname: updatedUser.surname, email: updatedUser.email },
      message: 'Data has been updated successfully',
    });
    
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;

  if (!oldPassword || !newPassword || !email) {
    return res.status(422).send({ message: 'You must provide all required data' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    user.comparePasswords(oldPassword, async (err, isMatch) => {
      if (err) {
        return res.status(500).send({ message: 'Internal server error' });
      }

      if (isMatch) {
        user.password = newPassword;
        await user.save();
        return res.status(200).send({ message: 'Password updated successfully' });
      }

      res.status(401).send({ message: 'Incorrect old password' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const deleteAccount = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).send({ message: 'You have to provide an email'})
  }

  try {
    User.deleteOne({ email })

    console.log('deleted')

    res.status(200).send({ message: 'The account has been deleted successfully'})
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
}
