const router = require('express').Router();
const { 
    getAllThought,
    getThoughtById,
    addThought, 
    updateThought,
    removeThought,
     addReaction, 
     removeReaction 

    } = require('../../controllers/thought-controller');

// Set up GET all and POST at /api/user
router.route('/')
  .get(getAllThought)
  .post(addThought)

// Set up GET one, PUT, and DELETE at /api/pizzas/:id
router
  .route('/:thoughtid')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);


// /api/comments/<userId>/<thoughtId>
router.route('/:thoughtId/reactions')
.post(addReaction)

// Delete reaction

router.route('/:thoughtId/reactions/:reactionId')
.delete(removeReaction);

module.exports = router;