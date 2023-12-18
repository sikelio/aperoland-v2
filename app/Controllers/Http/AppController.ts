import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class AppController {
  getHome({ view }: HttpContextContract) {
    return view.render('app/home');
  }
}
