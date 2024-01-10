import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema } from '@ioc:Adonis/Core/Validator';
import Hash from '@ioc:Adonis/Core/Hash';

import User from 'App/Models/User';

export default class ProfilesController {
  public async profile({ view, auth }: HttpContextContract) {
    const user = await User.find(auth.user!.id);

    return view.render('profile/me', {
      user
    });
  }

  public async updatePassword({ response, request, auth }: HttpContextContract) {
    const password = request.input('password');
    const newPassword = request.input('newPassword');
    const confirmNewPassword = request.input('confirmNewPassword');

    const passwordSchema = schema.create({
      password: schema.string({ trim: true }, []),
      newPassword: schema.string({ trim: true }, []),
      confirmNewPassword: schema.string({ trim: true }, []),
    });

    try {
      await request.validate({ schema: passwordSchema });

      if (newPassword !== confirmNewPassword) {
        return response.status(400).send({
          message: 'Le nouveau mot de passe ainsi que sa confirmation ne correspondent pas',
          success: false
        });
      }

      let user = await User.find(auth.user!.id);

      if (!(await Hash.verify(user!.password, password))) {
        return response.status(401).send({
          message: 'Votre mot de passe actuel est incorrect',
          success: false
        });
      }

      user!.password = newPassword;

      await user!.save();

      return response.send({
        message: 'Votre mot de passe à bien été changé, cela prendra effet à la prochaine connexion',
        success: true
      });
    } catch (error: any) {
      return response.status(500).send({
        message: 'Une erreur est survenue',
        success: false
      });
    }
  }

  public async deleteProfile({ auth, response }: HttpContextContract) {
    try {
      const user = await User.find(auth.user!.id);
      await user!.delete();
      await auth.logout();

      return response.send({
        success: true,
        message: 'Account deleted!'
      });
    } catch (error: any) {
      return response.status(500).send({
        success: false,
        message: 'Something went wrong!'
      });
    }
  }
}
