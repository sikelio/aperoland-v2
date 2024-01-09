import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User';

export default class ProfilesController {
  public async profile({ view, auth }: HttpContextContract) {
    const user = await User.find(auth.user!.id);

    return view.render('profile/me', {
      user
    });
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
