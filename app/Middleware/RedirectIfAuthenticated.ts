import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class RedirectIfAuthenticated {
	public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
		if (auth.user && request.url() !== '/auth/logout') {
			return response.redirect().toRoute('app.home.get');
		}

		await next();
	}
}
