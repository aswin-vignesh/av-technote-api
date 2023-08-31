const express = require('express');
const router = express.Router();
const notesController = require("../controllers/notesController");
const verifyJwt = require('../middleware/verifyJWT');

router.use(verifyJwt); 

// http methods
router.route('/')

    .get(notesController.getAllNotes)
    .post(notesController.createNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

module.exports = router;