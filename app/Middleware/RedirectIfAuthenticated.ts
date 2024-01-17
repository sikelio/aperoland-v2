import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class RedirectIfAuthenticated {
	public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
    const ignoreUrl: string[] = ['/auth/logout', '/auth/spotify', '/auth/spotify/callback'];

    if (auth.user && !ignoreUrl.includes(request.url())) {
      return response.redirect().toRoute('app.home.get');
    }

		await next();
	}
}
