
const { request, response } = require('express');
const express = require('express');
var router = express.Router();
var accountController = require('../Conttrollers/accountController');

router.post('/register', accountController.Register);

router.post('/login', accountController.login);

router.get('/', accountController.getAccount);

router.get('/:id', accountController.getAccountID); //lay theo id

router.get('/aa', accountController.getAccountCreate);

router.post('/ss', accountController.postAccount);

router.get('/edit/:id', accountController.getAccountEdit);

router.post('/edit/:id', accountController.putAccountID); //update theo id

router.post('/delete/:id', accountController.deleteAccountID); //xoa theo id

router.put('/:id', accountController.updateJob);

router.post('/:id', accountController.createJob);

module.exports = router