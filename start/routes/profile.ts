import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/me', 'ProfileController.profile').as('app.profile.me');
}).prefix('/profile').middleware('auth');
