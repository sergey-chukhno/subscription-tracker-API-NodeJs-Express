import express from 'express';
import { PORT } from './config/env.js';

const app = express();

app.get('/', (req, resp) => {
  resp.send("Welcome to the Subscription Tracker");
})

app.listen(PORT, () => {
  console.log(`Subscription Tracker API running on http://localhost:${PORT}`);
});

export default app;