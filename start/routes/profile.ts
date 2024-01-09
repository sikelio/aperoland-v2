import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/me', 'ProfileController.profile').as('app.profile.me');

  Route.post('/me/delete', 'ProfileController.deleteProfile');
}).prefix('/profile').middleware('auth');
