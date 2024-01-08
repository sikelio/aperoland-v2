import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User';

export default class ProfilesController {
  public async profile({ view, auth }: HttpContextContract) {
    const user = await User.find(auth.user!.id);

    return view.render('profile/me', {
      user
    });
  }
}
