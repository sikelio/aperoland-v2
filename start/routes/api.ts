import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.get('/location', 'ApiController.location');

  Route.group(() => {
    Route.get('/search', 'ApiController.songSearch');
  }).prefix('/spotify');
}).prefix('/api').middleware('apiAuth');
