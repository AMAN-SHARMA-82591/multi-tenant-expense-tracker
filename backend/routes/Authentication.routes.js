import express from 'express';

const router = express.Router();

router.post('/sign-up', (req, res) => {
    res.end('working sign-up');
})
router.post('/sign-in', (req, res) => {
    res.end('working sign-in');
})

export default router;