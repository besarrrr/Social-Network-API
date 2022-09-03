const { User, Thought } = require('../models');

const thoughtController = {

      // Get all thoughts 
      getAllThought(req,res) {
        Thought.find({})
      .then((dbThought) => res.json(dbThought))
      .catch((err) => res.status(500).json(err))
    },

    // get one thought by id

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({path: 'reactions',select: '-__v'})
        .select('-__v')
        .then(dbThought => {
        if (!dbThought) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
        }
        res.json(dbThought);
        })
        .catch(err => {
        console.log(err);
        res.status(400).json(err);
        });
},

// create a thought

addThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbThought => {
        if (!dbThought) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbThought);
      })
      .catch(err => res.json(err));
  },

  // update a thoguht

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $set: { thoughts: body } },
      { new: true, runValidators: true }
    )
      .then(dbThought => {
        if (!dbThought) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThought);
      })
      .catch(err => res.json(err));
  },

  //delete a thought

  removeThought({ params }, res) {
    Thought.findOneAndDelete({_id: params.id})
    .then(dbThought => {
        if (!dbThought) {
            res.status(404).json({message: 'No thoughts with this particular ID!'});
            return;
        }
        res.json(dbThought);
        })
        .catch(err => res.status(400).json(err));
},

  // create a reaction

  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate({_id: params.thoughtId}, {$push: {reactions: body}}, {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThought => {
        if (!dbThought) {
            res.status(404).json({message: 'No thoughts with this particular ID!'});
            return;
        }
        res.json(dbThought);
        })
        .catch(err => res.status(400).json(err))
  },
  
  // remove reaction

  removeReaction({ params }, res) {
    Thought.findOneAndUpdate({_id: params.thoughtId}, {$pull: {reactions: {reactionId: params.reactionId}}}, {new : true})
        .then(dbThought => {
            if (!dbThought) {
                res.status(404).json({message: 'No thoughts with this particular ID!'});
                return;
            }
            res.json(dbThought);
        })
        .catch(err => res.status(400).json(err));
  }

}

module.exports = thoughtController; 