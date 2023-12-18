import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RedirectIfAuthenticated {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user) {
      return response.redirect('/app');
    }

    await next();
  }
}
