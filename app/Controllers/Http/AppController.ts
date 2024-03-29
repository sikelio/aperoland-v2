import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { HasManyQueryBuilderContract, RelationQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm';
import Event from 'App/Models/Event';
import User from 'App/Models/User';
import RandomGenerator from 'App/Utility/RandomGenerator';

import ValidationRule from 'App/Interfaces/ValidationRule';
import ValidationRules from 'App/Enums/ValidationRules';
import ValidationMessages from 'App/Enums/ValidationMessages';

import type ChatMessage from 'App/Models/ChatMessage';
import type Playlist from 'App/Models/Playlist';

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

  public async getEditEvent({ view, params, auth, response }: HttpContextContract) {
    const eventId = params.id;

    try {
      const event = await Event.findOrFail(eventId);
      event.setTempUserId(auth.user!.id);

      if (event.isCreator === false) {
        return response.redirect().toRoute('app.event.get', { id: eventId });
      }

      event.setTempStart(event.startDateTime.toString().slice(0,16));
      event.setTempEnd(event.endDateTime.toString().slice(0,16));

      return view.render('app/edit-event', {
        event: event
      });
    } catch (error: any) {
      return response.redirect().toRoute('app.event.get', { id: eventId });
    }
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
			address: schema.string.optional({ trim: true }, []),
			lat: schema.number.optional([rules.requiredIfExists('address')]),
			long: schema.number.optional([rules.requiredIfExists('address')]),
		});

		try {
			await request.validate({ schema: eventSchema });

			const event = await Event.create({
				eventName: request.input('eventName'),
				creatorId: auth.user!.id,
				description: request.input('description') ? request.input('description') : null,
				startDateTime: request.input('startDateTime'),
				endDateTime: request.input('endDateTime'),
				joinCode: RandomGenerator.generateJoinCode(),
				address: request.input('address') ? request.input('address') : null,
				lat: request.input('lat') ? request.input('lat') : null,
				long: request.input('long') ? request.input('long') : null,
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

				if (
					error.rule === ValidationRules.REQUIRE_IF_EXIST &&
					error.message === ValidationMessages.REQUIRE_IF_EXIST
				) {
					switch (error.field) {
						case 'lat':
							reasons.push("La latitude est requise si l'adresse est renseignée");
							break;
						case 'long':
							reasons.push("La longitude est requise si l'adresse est renseignée");
							break;
					}
				}

				if (error.rule === ValidationRules.NUMBER && error.message === ValidationMessages.NUMBER) {
					switch (error.field) {
						case 'lat':
							reasons.push('La latitude soit être un nombre');
							break;
						case 'long':
							reasons.push('La longitude soit être un nombre');
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

  public async editEvent({ request, response, auth, params }: HttpContextContract) {
    try {
      const event = await Event.findOrFail(params.id);
      event.setTempUserId(auth.user!.id);

      if (!event.isCreator) {
        return response.status(403).send({
          message: 'Vous n\'êtes pas le créateur de cet Apéro',
          success: false
        });
      }

      if (new Date(request.input('startDateTime')) >= new Date(request.input('endDateTime'))) {
        return response.status(400).send({
          message: 'Erreur de saisie !',
          success: false,
          reasons: [
            "Vous ne pouvez pas modifier un Apéro avec une date de début supérieure à la date de fin !",
          ],
        });
      }

      const eventSchema = schema.create({
        eventName: schema.string({ trim: true }, [rules.maxLength(255), rules.minLength(5)]),
        description: schema.string.optional({ trim: true }, [rules.maxLength(1000)]),
        startDateTime: schema.date({}, []),
        endDateTime: schema.date({}, []),
        address: schema.string.optional({ trim: true }, []),
        lat: schema.number.optional([rules.requiredIfExists('address')]),
        long: schema.number.optional([rules.requiredIfExists('address')]),
      });

			await request.validate({ schema: eventSchema });

      event.eventName = request.input('eventName');
      event.description = request.input('description');
      event.startDateTime = request.input('startDateTime');
      event.endDateTime = request.input('endDateTime');
      event.address = request.input('address');
      event.lat = request.input('lat');
      event.long = request.input('long');

      await event.save();

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

				if (
					error.rule === ValidationRules.REQUIRE_IF_EXIST &&
					error.message === ValidationMessages.REQUIRE_IF_EXIST
				) {
					switch (error.field) {
						case 'lat':
							reasons.push("La latitude est requise si l'adresse est renseignée");
							break;
						case 'long':
							reasons.push("La longitude est requise si l'adresse est renseignée");
							break;
					}
				}

				if (error.rule === ValidationRules.NUMBER && error.message === ValidationMessages.NUMBER) {
					switch (error.field) {
						case 'lat':
							reasons.push('La latitude soit être un nombre');
							break;
						case 'long':
							reasons.push('La longitude soit être un nombre');
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

			const event = await Event.query().where('join_code', '=', request.input('joinCode')).first();

			if (event === null) {
				return response.status(404).send({
					message: 'Code invalide',
					reasons: ["L'Apéro est inconnu"],
					success: false,
				});
			}

			const user = await User.findOrFail(auth.user!.id);
			await user.related('events').attach([event!.id]);

			return response.send(event.id);
		} catch (error: any) {
			if (error === 'Exception: E_ROW_NOT_FOUND: Row not found') {
				return response.status(404).send({
					message: 'Apéro non trouvé',
					success: false,
				});
			}

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
				error,
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
      await event.load('messages', (messagesQuery: HasManyQueryBuilderContract<typeof ChatMessage, any>) => messagesQuery.preload('user'));
      await event.load('playlist', (playlistQuery: RelationQueryBuilderContract<typeof Playlist, any>) => playlistQuery.preload('songs'));

			event.setTempUserId(auth.user!.id);
			event.messages.forEach((message: ChatMessage) => message.setTempUserId(auth.user!.id));
			event.attendees.forEach((attendee: User) => {
				attendee.setTempUserId(auth.user!.id);
				attendee.setTempCreatorUserId(event.creatorId);
			});

      event.lat = event.lat ? event.lat : 0;
      event.long = event.long ? event.long : 0;

			return view.render('app/event', {
				event,
				title: event.eventName,
				userId: auth.user!.id,
        noMessages: event.messages.length === 0
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

  public async deleteEvent({ params, response, auth }: HttpContextContract) {
    const eventId = params.id;

    try {
      const event = await Event.findOrFail(eventId);
      event.setTempUserId(auth.user!.id);

      if (!event.isCreator) {
        return response.status(403).send({
          message: "Vous n'êtes pas autorisé à effectuer cette action",
          success: false,
        });
      }

      await event.delete();

      return response.send({
				message: 'Apéro supprimé',
				success: true,
			});
    } catch (error: any) {
      return response.status(500).send({
        success: false,
        message: 'Something went wrong',
      });
    }
  }

  public async getEventLocation({ response, params }: HttpContextContract) {
    const eventId = params.id;

    try {
      const event = await Event.findOrFail(eventId);

      return response.send({
        address: event.address,
        lat: event.lat,
        long: event.long
      });
    } catch (error: any) {
      return response.status(500).send({
        message: 'Something went wrong',
        success: false
      });
    }
  }

  public async changeEventCode({ params, response, auth }: HttpContextContract) {
    const eventId = params.id;

    try {
      const event = await Event.findOrFail(eventId);
      event.setTempUserId(auth.user!.id);

      if (event.isCreator) {
        return response.status(403).send({
          message: 'Vous n\'êtes pas le créateur de cet Apéro'
        });
      }

      let newCode = RandomGenerator.generateJoinCode();

      event.joinCode = newCode;
      await event.save();

      return response.send({
        message: 'Le code d\'invitation a bien été modifié',
        code: newCode
      });
    } catch (error: any) {
      return response.status(500).send({
        message: 'Quelque chose s\'est mal passé !',
        success: false
      });
    }
  }

  public async leaveEvent({ auth, response, params }: HttpContextContract) {
    const eventId: number = params.id;

    try {
      const user: User = await auth.use('web').authenticate();
      const event: Event = await Event.findOrFail(eventId);
      event.setTempUserId(user.id);

      if (event.isCreator) {
        return response.status(403).send({
          message: 'Vous êtes le créateur de cet Apéro, vous ne pouvez pas quitter sauf si vous supprimer l\'Apéro',
          success: false
        });
      }

      await event.related('attendees').detach([user.id]);

      return response.send({
        message: 'Vous ne faites plus partie de l\'Apéro',
        success: true
      });
    } catch (error: any) {
      return response.status(500).send([]);
    }
  }
}
