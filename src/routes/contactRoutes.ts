import express from 'express';
import { getContacts, createContact, updateContact, searchContactsByName, getContactById } from '../controllers/contactController';
import { authenticateToken } from '../middlewares/authentication';
import multer from 'multer';

const upload = multer();
const router = express.Router();

router.get('/', authenticateToken, getContacts);
router.post('/', authenticateToken, createContact);
router.put('/:contactId', authenticateToken, updateContact);
router.get('/search', authenticateToken, searchContactsByName); 
router.get('/getbyid', authenticateToken, getContactById); 


export default router;
