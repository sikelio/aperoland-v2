import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';

interface IValidationRule {
  rule: string,
  field: string,
  message: string
}

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
    if (request.input('confirmPassword') !== request.input('password')) {
      return response.status(400).send({
        message: 'Les mots de passe ne correspondent pas',
        success: false
      });
    }

    const userSchema = schema.create({
      username: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username', caseInsensitive: true })]),
      email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email', caseInsensitive: true })]),
      password: schema.string({}, [rules.minLength(8)])
    });

    try {
      const data = await request.validate({ schema: userSchema });
      const user = await User.create(data);

      await auth.login(user);

      return response.send({
        message: 'Vous êtes maintenant connecté ! Redirection en cours...',
        success: true,
      });
    } catch (error) {
      let reasons: string[] = [];

      error.messages.errors.forEach((error: IValidationRule) => {
        if (error.rule === 'unique' && error.message === 'unique validation failure') {
          switch (error.field) {
            case 'email':
              reasons.push('L\'adresse mail est déjà utilisée')
              break;
            case 'username':
              reasons.push('Le pseudo est déjà utilisé')
              break;
          }
        }

        if (error.rule === 'minLength' && error.message === 'minLength validation failed') {
          switch (error.field) {
            case 'password':
              reasons.push('Le mot de passe est trop court (8 caractères min.)')
              break;
          }
        }
      });

      return response.status(400).send({
        message: 'Validation error!',
        success: false,
        reasons: reasons
      })
    }
  }
}
