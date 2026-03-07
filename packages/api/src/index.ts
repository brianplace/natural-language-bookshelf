import 'dotenv/config';
import express from 'express';
import authRouter from './routes/auth';
import booksRouter from './routes/books';
import shelvesRouter from './routes/shelves';
import lendingRouter from './routes/lending';
import templatesRouter from './routes/templates';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/shelves', shelvesRouter);
app.use('/lending', lendingRouter);
app.use('/templates', templatesRouter);

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
