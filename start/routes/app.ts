import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
	Route.get('/', 'AppController.getHome')
}).prefix('/app')
