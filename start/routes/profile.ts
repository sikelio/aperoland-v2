import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'ProfileController.profile').as('app.profile.me');

    Route.post('/delete', 'ProfileController.deleteProfile');

    Route.patch('/change-password', 'ProfileController.updatePassword');
  }).prefix('/me');
}).prefix('/profile').middleware('auth');
