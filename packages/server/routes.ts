import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { never } from 'zod';
import { PrismaClient } from './generated/prisma';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send(`hello world!`);
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello World!' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
   const prisma = new PrismaClient();
   const productId = Number(req.params.id);

   if (isNaN(productId)) {
      res.status(400).json({ error: 'Invaild product ID.' });
      return;
   }

   const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
   });

   res.json(reviews);
});

export default router;
