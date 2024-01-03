import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Event from 'App/Models/Event';
import User from 'App/Models/User';

import ValidationRule from 'App/Interfaces/ValidationRule';
import ValidationRules from 'App/Enums/ValidationRules';
import ValidationMessages from 'App/Enums/ValidationMessages';

import RandomGenerator from 'App/Utility/RandomGenerator';

export default class AppController {
  public async getHome({ view, auth }: HttpContextContract) {
    const user = await User.findOrFail(auth.user!.id);
    await user.load('events', (eventsQuery) => {
      eventsQuery.orderBy('startDateTime', 'asc');
    });

    user.events.forEach((event) => event.setTempUserId(user.id));

    return view.render('app/home', {
      events: user.events,
      hasEvents: user.events.length > 0,
    });
  }

  public getAddEvent({ view }: HttpContextContract) {
    return view.render('app/new-event');
  }

  public async postAddEvent({ request, response, auth }: HttpContextContract) {
    if (new Date(request.input('startDateTime')) >= new Date(request.input('endDateTime'))) {
      return response.status(400).send({
        message: 'Erreur de saisie !',
        success: false,
        reasons: [
          "Vous ne pouvez pas créer d'Apéro avec une date de début supérieure à la date de fin !",
        ],
      });
    }

    const eventSchema = schema.create({
      eventName: schema.string({ trim: true }, [rules.maxLength(255), rules.minLength(5)]),
      description: schema.string.optional({ trim: true }, [rules.maxLength(1000)]),
      startDateTime: schema.date({}, []),
      endDateTime: schema.date({}, []),
    });

    try {
      await request.validate({ schema: eventSchema });

      const event = await Event.create({
        eventName: request.input('eventName'),
        creatorId: auth.user!.id,
        description: request.input('description'),
        startDateTime: request.input('startDateTime'),
        endDateTime: request.input('endDateTime'),
        joinCode: RandomGenerator.generateJoinCode(),
      });

      await event.related('attendees').attach([auth.user!.id]);

      return response.send({ message: 'Apéro crée', event });
    } catch (error) {
      let reasons: string[] = [];

      error.messages.errors.forEach((error: ValidationRule) => {
        if (
          error.rule === ValidationRules.MAX_LENGTH &&
          error.message === ValidationMessages.MAX_LENGTH
        ) {
          switch (error.field) {
            case 'eventName':
              reasons.push("Le nom de l'Apéro est trop long (255 caractères max.)");
              break;
            case 'description':
              reasons.push("La description de l'Apéro est trop longue (1000 caractères max)");
              break;
          }
        }

        if (
          error.rule === ValidationRules.MIN_LENGTH &&
          error.message === ValidationMessages.MIN_LENGTH
        ) {
          switch (error.field) {
            case 'eventName':
              reasons.push("Le nom de l'Apéro est trop court (5 caractères min.)");
              break;
          }
        }

        if (
          error.rule === ValidationRules.REQUIRED &&
          error.message === ValidationMessages.REQUIRED
        ) {
          switch (error.field) {
            case 'eventName':
              reasons.push("Le nom de l'Apéro est requis");
              break;
            case 'startDateTime':
              reasons.push("La date et l'heure de début de l'Apéro sont requis");
              break;
            case 'endDateTime':
              reasons.push("La date et l'heure de fin de l'Apéro sont requis");
              break;
          }
        }

        if (error.rule === ValidationRules.DATE_FORMAT) {
          switch (error.field) {
            case 'startDateTime':
              reasons.push("La date de début de l'Apéro n'est pas dans un format reconnus");
              break;
            case 'endDateTime':
              reasons.push("La date de fin de l'Apéro n'est pas dans un format reconnus");
              break;
          }
        }
      });

      return response.status(400).send({
        message: 'Erreur de saisie !',
        success: false,
        reasons: reasons,
      });
    }
  }

  public async postJoinEvent({ response, request, auth }: HttpContextContract) {
    const joinEventSchema = schema.create({
      joinCode: schema.string({ trim: true }, []),
    });

    try {
      await request.validate({ schema: joinEventSchema });

      const event = await Event.query().where('join_code', '=', request.input('joinCode'));

      if (event.length === 0) {
        return response.status(404).send({
          success: false,
          message: 'Code non valide !',
        });
      }

      const user = await User.findOrFail(auth.user!.id);
      await user.related('events').attach([event[0].id]);

      return response.send(event);
    } catch (error: any) {
      let reasons: string[] = [];

      error.messages.errors.forEach((error: ValidationRule) => {
        if (
          error.rule === ValidationRules.REQUIRED &&
          error.message === ValidationMessages.REQUIRED
        ) {
          switch (error.field) {
            case 'joinCode':
              reasons.push("Le code d'Apéro est requis");
              break;
          }
        }
      });

      return response.status(400).send({
        message: 'Erreur de saisie !',
        success: false,
        reasons,
      });
    }
  }

  public async getEvent({ view, params, response, auth }: HttpContextContract) {
    try {
      const event = await Event.findOrFail(params.id);
      await event.load('attendees');
      await event.load('messages', (messagesQuery) => messagesQuery.preload('user'));

      event.setTempUserId(auth.user!.id);
      event.messages.forEach((message) => message.setTempUserId(auth.user!.id));
      event.attendees.forEach((attendee) => {
        attendee.setTempUserId(auth.user!.id);
        attendee.setTempCreatorUserId(event.creatorId);
      });

      return view.render('app/event', {
        event,
        title: event.eventName,
        userId: auth.user!.id,
      });
    } catch (error: any) {
      response.redirect().toRoute('app.home.get');
    }
  }

  public async deleteAttendeeFromEvent({ response, request, params, auth }: HttpContextContract) {
    const eventId = params.id;
    const userId = request.input('userId');

    const userSchema = schema.create({
      userId: schema.number([]),
    });

    try {
      await request.validate({ schema: userSchema });

      const event = await Event.findOrFail(eventId);
      event.setTempUserId(auth.user!.id);

      if (!event.isCreator) {
        return response.status(403).send({
          message: "Vous n'êtes pas autorisé à effectuer cette action",
          success: false,
        });
      }

      await event.related('attendees').detach([userId]);

      return response.send({
        message: 'Utilisateur retiré',
        success: true,
      });
    } catch (error: any) {
      if (error.name === 'ValidationException') {
        let reasons: string[] = [];

        error.messages.errors.forEach((error: ValidationRule) => {
          if (
            error.message === ValidationMessages.NUMBER &&
            error.rule === ValidationRules.NUMBER
          ) {
            switch (error.field) {
              case 'userId':
                reasons.push("L'ID de l'utilisateur doit être un nombre");
                break;
            }
          }

          if (
            error.message === ValidationMessages.REQUIRED &&
            error.rule === ValidationRules.REQUIRED
          ) {
            switch (error.field) {
              case 'userId':
                reasons.push("L'ID de l'utilisateur est requis");
                break;
            }
          }
        });

        return response.status(400).send({
          message: 'Erreur de saisie !',
          success: false,
          reasons,
        });
      }

      return response.status(500).send({
        success: false,
        message: 'Something went wrong',
      });
    }
  }
}
