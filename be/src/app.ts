import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { corsConfig, helmetConfig } from '~/configs';
import { authenticate, errorHandler, languageDetector, notFoundHandler } from '~/middlewares';
import { modulesConfig } from '~/modules';

const app = express();

app.use(helmet(helmetConfig));
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(languageDetector);

// Mount modules
modulesConfig.forEach(({ path, router, isPublic }) => {
  if (isPublic) {
    app.use(`/api${path}`, router);
  } else {
    app.use(`/api${path}`, authenticate, router);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
