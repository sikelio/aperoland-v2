import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route
    .get('/home', 'AppController.getHome')
    .as('app.home.get');
})
  .prefix('/app')
  .middleware('auth');
