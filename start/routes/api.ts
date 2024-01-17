import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.get('/location', 'ApiController.location');

  Route.group(() => {
    Route.post('/event/:id/create-playlist', 'ApiController.createPlaylist');

    Route.post('/event/:id/add-song', 'ApiController.addSong');

    Route.get('/search-songs', 'ApiController.songSearch');
  }).prefix('/spotify');
}).prefix('/api').middleware('apiAuth');
