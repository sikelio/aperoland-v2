import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
	Route.get('/home', 'AppController.getHome').as('app.home.get');

	Route.get('/add-event', 'AppController.getAddEvent').as('app.add.event.get');

	Route.post('/add-event', 'AppController.postAddEvent').as('app.add.event.post');

	Route.post('/join-event', 'AppController.postJoinEvent').as('app.join.event.post');

  Route.group(() => {
    Route.get('/:id', 'AppController.getEvent').as('app.event.get').middleware('eventHandler');

    Route.get('/:id/edit', 'AppController.getEditEvent').as('app.edit.event.get');

    Route.delete('/:id/delete', 'AppController.deleteEvent');

    Route.delete('/:id/remove-attendee', 'AppController.deleteAttendeeFromEvent').as('app.remove.attendee.delete');
  }).prefix('/event');
})
	.prefix('/app')
	.middleware('auth');
