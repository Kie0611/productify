import express from 'express';
import * as commentController from "../controllers/commentController"
import { requireAuth } from '@clerk/express';
const router = express.Router();

router.post("/:productId", requireAuth(), commentController.createComment);
router.delete("/:commentId", requireAuth(), commentController.deleteComment)

export default router;