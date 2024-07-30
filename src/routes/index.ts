import { Router } from 'express';
import { VERSION } from '../config';
import { v1Routes } from './v1';

const routes: Router = Router();

routes.use(VERSION.v1, v1Routes);

export { routes };
