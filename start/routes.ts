import Route from '@ioc:Adonis/Core/Route';

import './routes/auth';
import './routes/app';
import './routes/api';
import './routes/profile';

Route.get('/', async ({ response }) => {
	return response.redirect('/auth/login');
});

Route.on('*').redirect('/auth/login');
