import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Event from 'App/Models/Event';

import IValidationRule from 'App/Interfaces/IValidationRule';
import ValidationRules from 'App/Enums/ValidationRules';
import ValidationMessages from 'App/Enums/ValidationMessages';

export default class AppController {
  getHome({ view }: HttpContextContract) {
    return view.render('app/home');
  }

  getAddEvent({ view }: HttpContextContract) {
    return view.render('app/new-event');
  }

  async postAddEvent({ request, response, auth }: HttpContextContract) {
    const eventSchema = schema.create({
      eventName: schema.string({ trim: true }, [
        rules.maxLength(255),
        rules.minLength(5)
      ]),
      description: schema.string.optional({ trim: true }, [
        rules.maxLength(1000)
      ]),
      startDateTime: schema.date({}, []),
      endDateTime: schema.date({}, [])
    });

    try {
      await request.validate({ schema: eventSchema });
      await Event.create({
        eventName: request.input('eventName'),
        creatorId: auth.user!.id,
        description: request.input('description'),
        startDateTime: request.input('startDateTime'),
        endDateTime: request.input('endDateTime')
      });

      return response.send({ message: 'Apéro crée' });
    } catch (error) {
      let reasons: string[] = [];

      error.messages.errors.forEach((error: IValidationRule) => {
        if (error.rule === ValidationRules.MAX_LENGTH && error.message === ValidationMessages.MAX_LENGTH) {
          switch (error.field) {
            case 'eventName':
              reasons.push('Le nom de l\'Apéro est trop long (255 caractères max.)');
              break;
            case 'description':
              reasons.push('La description de l\'Apéro est trop longue (1000 caractères max)');
              break;
          }
        }

        if (error.rule === ValidationRules.MIN_LENGTH && error.message === ValidationMessages.MIN_LENGTH) {
          switch (error.field) {
            case 'eventName':
              reasons.push('Le nom de l\'Apéro est trop court (5 caractères min.)');
              break;
          }
        }

        if (error.rule === ValidationRules.REQUIRED && error.message === ValidationMessages.REQUIRED) {
          switch (error.field) {
            case 'eventName':
              reasons.push('Le nom de l\'Apéro est requis');
              break;
            case 'startDateTime':
              reasons.push('La date et l\'heure de début de l\'Apéro sont requis');
              break;
            case 'endDateTime':
              reasons.push('La date et l\'heure de fin de l\'Apéro sont requis');
              break;
          }
        }
      });

      return response.status(400).send({
        message: 'Erreur de saisie !',
        success: false,
        reasons: reasons
      });
    }
  }
}
