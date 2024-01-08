import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import jwt from 'jsonwebtoken';
import Env from '@ioc:Adonis/Core/Env';

import ValidationRule from 'App/Interfaces/ValidationRule';
import ValidationRules from 'App/Enums/ValidationRules';
import ValidationMessages from 'App/Enums/ValidationMessages';

export default class AuthController {
  public getLogin({ view }: HttpContextContract) {
    return view.render('auth/login');
  }

  public async postLogin({ auth, request, response }: HttpContextContract) {
    const uid = request.input('uid');
    const password = request.input('password');

    try {
      await auth.use('web').attempt(uid, password);

      const user = auth.use('web').user!;
      const token = jwt.sign({ id: user.id, username: user.username }, Env.get('JWT_SECRET'), {
        expiresIn: '24h',
      });

      return response.status(200).send({
        message: "You're now logged in",
        token: token,
      });
    } catch {
      return response.badRequest({
        message: 'Invalid credentials',
      });
    }
  }

  public getRegister({ view }: HttpContextContract) {
    return view.render('auth/register');
  }

  public async postRegister({ request, auth, response }: HttpContextContract) {
    if (request.input('confirmPassword') !== request.input('password')) {
      return response.status(400).send({
        message: 'Les mots de passe ne correspondent pas',
        success: false,
      });
    }

    const userSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      ]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      password: schema.string({}, [rules.minLength(8)]),
    });

    try {
      const data = await request.validate({ schema: userSchema });
      const user = await User.create(data);

      await auth.login(user);

      const token = jwt.sign({ id: user.id, username: user.username }, Env.get('JWT_SECRET'), {
        expiresIn: '24h',
      });

      return response.send({
        message: 'Vous êtes maintenant connecté ! Redirection en cours...',
        token: token,
        success: true,
      });
    } catch (error) {
      let reasons: string[] = [];

      error.messages.errors.forEach((error: ValidationRule) => {
        if (error.rule === ValidationRules.UNIQUE && error.message === ValidationMessages.UNIQUE) {
          switch (error.field) {
            case 'email':
              reasons.push("L'adresse mail est déjà utilisée");
              break;
            case 'username':
              reasons.push('Le pseudo est déjà utilisé');
              break;
          }
        }

        if (
          error.rule === ValidationRules.MIN_LENGTH &&
          error.message === ValidationMessages.MAX_LENGTH
        ) {
          switch (error.field) {
            case 'password':
              reasons.push('Le mot de passe est trop court (8 caractères min.)');
              break;
          }
        }
      });

      return response.status(400).send({
        message: 'Validation error!',
        success: false,
        reasons: reasons,
      });
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout();

    return response.status(200).send({
      messsage: 'Vous êtes à présent déconnecté',
      success: true,
    });
  }
}
