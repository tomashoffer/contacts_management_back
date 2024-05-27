import express from 'express';
import { getContacts, createContact, updateContact, searchContactsByName, getContactById } from '../controllers/contactController';
import { authenticateToken } from '../middlewares/authentication';
import { validateCreateContact, validateUpdateContact, handleContactValidationErrors } from '../middlewares/contactValidation';

const router = express.Router();

router.get('/', authenticateToken, getContacts);
router.post('/', authenticateToken, validateCreateContact, handleContactValidationErrors, createContact); 
router.put('/:contactId', authenticateToken, validateUpdateContact, handleContactValidationErrors, updateContact); 
router.get('/search', authenticateToken, searchContactsByName); 
router.get('/getbyid', authenticateToken, getContactById); 

export default router;
