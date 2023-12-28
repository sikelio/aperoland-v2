import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/home', 'AppController.getHome').as('app.home.get');

  Route.get('/add-event', 'AppController.getAddEvent').as('app.add.event.get');

  Route.post('/add-event', 'AppController.postAddEvent').as('app.add.event.post');

  Route.post('/join-event', 'AppController.postJoinEvent').as('app.join.event.post');

  Route.get('/event/:id', 'AppController.getEvent').as('app.event.get').middleware('eventHandler');

  Route.delete('/event/:id/remove-attendee', 'AppController.deleteAttendeeFromEvent').as('app.remove.attendee.delete');
})
  .prefix('/app')
  .middleware('auth');
