import express from 'express';
import { getContacts, createContact, updateContact, uploadFile } from '../controllers/contactController';
import { authenticateToken } from '../middlewares/authentication';
import multer from 'multer';

const upload = multer();
const router = express.Router();

router.get('/', authenticateToken, getContacts);
router.post('/', authenticateToken, createContact);
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file); 
        if (!req.file) {
            throw new Error("No file uploaded");
        }
        const fileUrl = await uploadFile(req.file); 
        res.status(200).json({ fileUrl })
    } catch (error) {
        res.send(error);
    }
});

router.put('/:contactId', authenticateToken, updateContact);



export default router;
