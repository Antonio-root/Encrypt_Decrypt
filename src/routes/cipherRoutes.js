import express from 'express';
import { encryptCaesar, encryptVigenere, decryptCaesar, decryptVigenere, getHistory } from '../controllers/cipherController.js';

const router = express.Router();

router.post('/caesar', encryptCaesar);
router.post('/caesar/decrypt', decryptCaesar);
router.post('/vigenere', encryptVigenere);
router.post('/vigenere/decrypt', decryptVigenere);
router.get('/history', getHistory);

export default router;
