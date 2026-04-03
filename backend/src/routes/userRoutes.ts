import express from 'express';
import { syncUser } from '../controllers/userController'
import { requireAuth } from '@clerk/express';

const router = express.Router();

router.post("/sync", requireAuth() ,syncUser)

export default router;