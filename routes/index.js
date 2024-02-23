const express = require('express');
const router = express.Router();
const multer = require('multer');
const { UserController } = require('../controllers');

const uploadDestination = 'uploads';

//Храним файлы тут
const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: function (req, file, cb) {
        cd(null, file.originalname)
    }
});

const uploads = multer({storage: storage})


router.post('/register', UserController.register)
router.get('/login', UserController.login)
router.post('/current', UserController.currentUser)
router.post('/users/:id', UserController.login)
router.post('/users/:id', UserController.updateUser)

module.exports = router;