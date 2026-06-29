import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { corsConfig, helmetConfig } from './configs';

const app = express();

app.use(helmet(helmetConfig));
app.use(cors(corsConfig));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

export default app;
