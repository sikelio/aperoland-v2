import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/login', 'AuthController.getLogin');

  Route.post('/login', 'AuthController.postLogin');

  Route.get('/register', 'AuthController.getRegister');

  Route.post('/register', 'AuthController.postRegister');
}).prefix('/auth');
