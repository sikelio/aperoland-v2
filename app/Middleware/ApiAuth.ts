import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class ApiAuth {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.user) {
      return response
        .status(403)
        .send({
          message: 'Vous n\'êtes pas connecté !',
          success: false
        });
    }

    return next();
  }
}
