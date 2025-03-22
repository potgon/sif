import dotenv from 'dotenv';
import { createServer } from './config/server';
import prisma from './config/prisma';

dotenv.config();

const app = createServer(prisma);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});