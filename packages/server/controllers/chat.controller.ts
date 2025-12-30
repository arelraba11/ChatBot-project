import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';
import { route } from '../router/chat.router';

// Implementation detail
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required.')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
   conversationId: z.uuid(),
});

// Public interface
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);
      if (!parseResult.success) {
         res.status(400).json(z.treeifyError(parseResult.error));
         return;
      }

      try {
         const { prompt, conversationId } = req.body;

         const result = await route(prompt, conversationId);

         res.json({ message: result });
      } catch (error) {
         res.status(500).json({ error: ' Failed to generate a response.' });
      }
   },
};
