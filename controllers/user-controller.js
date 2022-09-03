const { User, Thought } = require('../models');

const userController = {

    // Get all Users
    getAllUser({ params },res) {
        User.find({})
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err))
    },

   // get one User by id

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate('thoughts')
        .populate('friends')
        .select('-__v')
        .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
        }
        res.json(dbUserData);
        })
        .catch(err => {
        console.log(err);
        res.status(400).json(err);
        });
},


// Create User

    createUser({ body}, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err))
    },


// Update User

    updateUser({params, body}, res){
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },


// Delete User

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
            }
            Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
            res.json(dbUserData);

        })
        .catch(err => res.status(400).json(err));
    },

// add friends

addFriend({params}, res) {
    User.findOneAndUpdate(
      { _id: params.Id },
      { $push: { friends: params.friendId } },
      { runValidators: true, new: true }
    )
    .populate({path: 'friends', select: ('-__v')})
    .select('-__v')
      .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No User found with this id!' });
        return;
        }
        res.json(dbUserData);
    })
      .catch((err) => res.status(500).json(err));
  },
  //delete a friend
  deleteFriend({ params}, res) {
    User.findOneAndUpdate(
      { _id: params.Id },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
    .populate({path: 'friends', select: '-__v'})
    .select('-__v')
    .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
          }
          res.json(dbUserData);
      })
        .catch((err) => res.status(500).json(err));
  },

};

module.exports = userController;