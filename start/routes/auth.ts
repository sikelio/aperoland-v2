import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/login', async ({ view }) => {
    return view.render('login');
  });

  Route.post('/login', async ({ auth, request, response }) => {
    const email = request.input('email');
    const password = request.input('password');

    try {
      await auth.use('web').attempt(email, password);

      return response.status(200).send({
        message: "You're now logged in",
      });
    } catch {
      return response.badRequest({
        message: 'Invalid credentials',
      });
    }
  })
}).prefix('/auth');
