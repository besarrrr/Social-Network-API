const { User, Thought } = require('../models');

const userController = {

    // Get all Users
    getAllUser(req,res) {
        User.find({})
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err))
    },

   // get one User by id

    getUserById({ params }, res) {
        User.findOne({ _id: req.params.userId })
        .populate("thoughts")
        .populate("friends")
        .select("-__v")
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
    }

};

module.exports = userController;