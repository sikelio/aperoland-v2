import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.get('/login', 'AuthController.getLogin').as('auth.login.get');

	Route.post('/login', 'AuthController.postLogin').as('auth.login.post');

	Route.get('/register', 'AuthController.getRegister').as('auth.register.get');

	Route.post('/register', 'AuthController.postRegister').as('auth.register.post');

	Route.post('/logout', 'AuthController.logout').as('auth.logout.post');

  Route.group(() => {
    Route.get('/', 'SpotifyController.redirect');

    Route.get('/callback', 'SpotifyController.callback');
  }).prefix('/spotify');
}).prefix('/auth').middleware('redirectIfAuthenticated');
