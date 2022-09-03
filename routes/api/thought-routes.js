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

// Set up GET all and POST 
router.route('/')
  .get(getAllThought)


  router.route('/:userId').post(addThought);

// Set up GET one, PUT, and DELETE 
router
  .route('/:id')
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