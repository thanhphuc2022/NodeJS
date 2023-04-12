
const { request, response } = require('express');
const express = require('express');
var router = express.Router();
var accountController = require('../Conttrollers/accountController');
const { createJWT } = require('../middleware/auth');

router.get('/register', accountController.getRegister);

router.post('/register', accountController.Register);

router.get('/login', accountController.getlogin);

router.post('/login', accountController.login);

// router.get('/', createJWT, accountController.getAccount);

// router.get('/:id', accountController.getAccountID); //lay theo id

router.get('/aa', accountController.getAccountCreate);

router.post('/ss', accountController.postAccount);

router.get('/edit/:id', accountController.getAccountEdit);

router.post('/edit/:id', accountController.putAccountID); //update theo id

router.post('/delete/:id', accountController.deleteAccountID); //xoa theo id

router.get('/editjob/:username', createJWT, accountController.getupdateJob);

router.post('/editjob/:username', createJWT, accountController.postupdateJob);

router.post('/createjob', createJWT, accountController.createJob);

router.post('/deletejob/:username', createJWT, accountController.deleteJob);

router.get('/todolish/:username', createJWT, accountController.toDojob);

router.post('/refresh', accountController.requestRefreshToken);

module.exports = router