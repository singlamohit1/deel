const express = require('express');
const router = express.Router();
const {getProfile} = require('../middleware/getProfile')

const ContractController = require('../controllers/contract')

router.get('/contracts/:id',getProfile ,ContractController.fetchContract)
router.get('/contracts',getProfile ,ContractController.fetchAllContracts)

module.exports = router;
