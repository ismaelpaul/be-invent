const express = require('express');
const { contactUs } = require('../controllers/contact.controllers');
const { protect } = require('../middleware/auth.middleware');

const contactRouter = express.Router();

contactRouter.post('/', protect, contactUs);

module.exports = contactRouter;
