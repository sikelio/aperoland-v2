import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import axios from 'axios';

export default class Spotify {
  public async handle({ response, auth }: HttpContextContract, next: () => Promise<void>): Promise<void> {
    const user: User | null = await User.find(auth.user!.id);

    if (user === null) {
      return response.status(401).send({
        message: 'Vous n\'êtes pas connecté',
        success: false
      });
    }

    if (!user.spotifyAccessToken || !user.spotifyRefreshToken || !await this.isConnected(user.spotifyAccessToken)) {
      return response.status(401).send({
        message: 'Vous n\'êtes pas connecté à Spotify',
        success: false
      });
    }

    await next();
  }

  private async isConnected(accessToken: string): Promise<boolean> {
    try {
      await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return true;
    } catch (error: any) {
      return false;
    }
  }
}
