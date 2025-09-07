import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname
        cb(null, uniqueName)
    },
})

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi', '.pdf'].includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false)
    }
}

export const upload = multer({ storage, fileFilter})

