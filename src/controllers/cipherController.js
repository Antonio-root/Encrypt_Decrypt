import EncryptionLog from '../models/EncryptionLog.js';

// Caesar Cipher Implementation
const caesarCipher = (str, shift) => {
    return str.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    });
};

// Vigenère Cipher Implementation
const vigenereCipher = (str, key) => {
    let result = '';
    let keyIndex = 0;
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');

    if (!cleanKey) return str;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (/[a-zA-Z]/.test(char)) {
            const base = char <= 'Z' ? 65 : 97;
            const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
            result += String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
};

export const encryptCaesar = async (req, res) => {
    try {
        const { text, shift } = req.body;
        if (!text || shift === undefined) {
            return res.status(400).json({ message: 'Text and shift are required' });
        }

        const shiftNum = parseInt(shift);
        const encryptedText = caesarCipher(text, shiftNum);

        const log = new EncryptionLog({
            originalText: text,
            algorithm: 'caesar',
            key: shiftNum,
            encryptedText,
            action: 'encrypt'
        });

        await log.save();

        res.json({ result: encryptedText, log });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const encryptVigenere = async (req, res) => {
    try {
        const { text, key } = req.body;
        if (!text || !key) {
            return res.status(400).json({ message: 'Text and key are required' });
        }

        const encryptedText = vigenereCipher(text, key);

        const log = new EncryptionLog({
            originalText: text,
            algorithm: 'vigenere',
            key: key,
            encryptedText,
            action: 'encrypt'
        });

        await log.save();

        res.json({ result: encryptedText, log });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const decryptCaesar = async (req, res) => {
    try {
        const { text, shift } = req.body;
        if (!text || shift === undefined) {
            return res.status(400).json({ message: 'Text and shift are required' });
        }

        const shiftNum = parseInt(shift);
        // Decryption is just encryption with negative shift
        const decryptedText = caesarCipher(text, (26 - (shiftNum % 26)));

        const log = new EncryptionLog({
            originalText: text,
            algorithm: 'caesar',
            key: shiftNum,
            encryptedText: decryptedText,
            action: 'decrypt'
        });

        await log.save();

        res.json({ result: decryptedText, log });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const decryptVigenere = async (req, res) => {
    try {
        const { text, key } = req.body;
        if (!text || !key) {
            return res.status(400).json({ message: 'Text and key are required' });
        }

        // Vigenere decryption logic
        let result = '';
        let keyIndex = 0;
        const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');

        if (!cleanKey) result = text;
        else {
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (/[a-zA-Z]/.test(char)) {
                    const base = char <= 'Z' ? 65 : 97;
                    const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
                    // (char - base - shift) % 26 ... handling negative result with +26
                    let diff = char.charCodeAt(0) - base - shift;
                    while (diff < 0) diff += 26;

                    result += String.fromCharCode((diff % 26) + base);
                    keyIndex++;
                } else {
                    result += char;
                }
            }
        }

        const log = new EncryptionLog({
            originalText: text,
            algorithm: 'vigenere',
            key: key,
            encryptedText: result,
            action: 'decrypt'
        });

        await log.save();

        res.json({ result, log });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHistory = async (req, res) => {
    try {
        const logs = await EncryptionLog.find().sort({ createdAt: -1 }).limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
