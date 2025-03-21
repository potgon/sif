import dotenv from 'dotenv';
import { createServer } from './config/server';

dotenv.config();

const app = createServer();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})