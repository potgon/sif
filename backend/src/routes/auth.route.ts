import { Router } from 'express';
import { loginUser, registerUser } from '../services/auth.service';
import { UserSchema } from '../schemas/user.schema';

const router = Router();
router.post('/register', async (req, res) => {
  try {
    const validatedData = UserSchema.parse(req.body);
    const user = await registerUser(validatedData);
    res.status(200).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error registering user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const validatedData = UserSchema.parse(req.body);
    const { token } = await loginUser(validatedData);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Error logging' });
  }
});

export const authRouter = router;