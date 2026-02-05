import express from 'express';
import errorHandling from './src/middleware/errormiddleware.js';
import AppError from './src/utils/AppError.js';

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello, Centralized Error Handling');
});

app.get('/users/:id', (req, res, next) => {
  if (!req.params.id) {
    return next(new AppError("User ID is required", 400));
  }
  res.json({ message: "User found" });
});

// ❗ Error middleware ALWAYS at the end
app.use(errorHandling);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
