import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';


export default class AuthController {
  getLogin({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  async postLogin({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      await auth.use('web').attempt(email, password)

      return response.status(200).send({
        message: "You're now logged in",
      })
    } catch {
      return response.badRequest({
        message: 'Invalid credentials',
      })
    }
  }

	getRegister({ view }: HttpContextContract) {
		return view.render('auth/register');
	}

  async postRegister({ request, auth, response }: HttpContextContract) {
    try {
      const userSchema = schema.create({
        username: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username', caseInsensitive: true })]),
        email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email', caseInsensitive: true })]),
        password: schema.string({}, [rules.minLength(8)])
      });

      const data = await request.validate({ schema: userSchema });
      const user = await User.create(data);

      await auth.login(user);

      return response.send({
        message: 'You\'re now connected! Redirecting...',
        success: true,
      });
    } catch (error) {
      console.error(error);
      
      return response.status(500).send({
        message: 'Something went wrong!',
        success: false,
        reasons: error.messages
      })
    }
  }
}
