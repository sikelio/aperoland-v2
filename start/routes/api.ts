import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/location', 'ApiController.location');
})
  .prefix('/api')
  .middleware('apiAuth');
