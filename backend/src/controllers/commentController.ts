import type { Request, Response } from 'express';
import * as queries from "../db/queries";

import { getAuth } from "@clerk/express";

export async function createComment(req: Request<{productId: string}>, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized"});

    const { productId } = req.params;
    const { content } = req.body;

    const product = await queries.getProductById(productId);
    if (!product) return res.status(404).json({ error: "Product not found"});


    const comment = await queries.createComment({
      content,
      userId,
      productId,
    });

    res.status(200).json(comment);
  } catch (error) {
    console.error("Failed to create comment:", error);
    return res.status(500).json({ error: "Failed to create comment" });
  }
}

export async function deleteComment(req: Request<{commentId: string}>, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
  
    const { commentId } = req.params;
    
    const existingComment = await queries.getCommentById(commentId);

    if (!existingComment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    };

    if(existingComment?.userId !== userId) {
      res.status(401).json({ error: "You can only delete your own comment" });
      return;
    }
  
    await queries.deleteComment(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return res.status(500).json({ error: "Failed to delete comment" });
    
  }

}