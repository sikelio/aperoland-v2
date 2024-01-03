import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class EventHandler {
  public async handle({ params, auth, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      const eventId = params.id;
      const isAttendee = await auth
        .user!.related('events')
        .query()
        .where('attendees.event_id', eventId)
        .first();

      if (!isAttendee) {
        return response.redirect().toRoute('app.home.get');
      }

      await next();
    } catch (error: any) {
      return response.redirect().toRoute('app.home.get');
    }
  }
}
