import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/home', 'AppController.getHome').as('app.home.get');

  Route.get('/add-event', 'AppController.getAddEvent').as('app.add.event.get');

  Route.post('/add-event', 'AppController.postAddEvent').as('app.add.event.post');

  Route.post('/join-event', 'AppController.postJoinEvent').as('app.join.event.post');
})
  .prefix('/app')
  .middleware('auth');
