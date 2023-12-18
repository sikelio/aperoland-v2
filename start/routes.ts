import Route from '@ioc:Adonis/Core/Route';

import './routes/auth';
import './routes/app';

Route.get('/', async ({ response }) => {
  return response.redirect('/auth/login');
});

Route.on('*').redirect('/auth/login');
