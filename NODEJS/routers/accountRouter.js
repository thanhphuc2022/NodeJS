
const { request, response } = require('express');
const express = require('express');
var router = express.Router();
var accountController = require('../Conttrollers/accountController');

router.get('/register', accountController.getRegister);

router.post('/register', accountController.Register);

router.get('/login', accountController.getlogin);

router.post('/login', accountController.login);

router.get('/', accountController.getAccount);

router.get('/:id', accountController.getAccountID); //lay theo id

router.get('/aa', accountController.getAccountCreate);

router.post('/ss', accountController.postAccount);

router.get('/edit/:id', accountController.getAccountEdit);

router.post('/edit/:id', accountController.putAccountID); //update theo id

router.post('/delete/:id', accountController.deleteAccountID); //xoa theo id

router.get('/editjob/:username', accountController.getupdateJob);

router.post('/editjob/:username', accountController.postupdateJob);

router.post('/createjob', accountController.createJob);

router.post('/deletejob/:username', accountController.deleteJob);

module.exports = router