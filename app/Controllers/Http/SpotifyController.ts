import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import User from 'App/Models/User';
import RandomGenerator from 'App/Utility/RandomGenerator';
import axios from 'axios';

import type { AxiosResponse } from 'axios';

export default class SpotifyController {
  public async redirect({ response }: HttpContextContract) {
    const clientId: string = Env.get('SPOTIFY_CLIENT_ID');
    const redirectUri: string = `http://localhost:${Env.get('PORT')}/auth/spotify/callback`;
    const scopes: string = 'user-read-private user-read-email playlist-modify-public';
    const state = RandomGenerator.generateState(16);

    const spotifyUrl: string = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

    return response.redirect(spotifyUrl);
  }


  public async callback({ response, request, auth }: HttpContextContract) {
    try {
      await auth.use('web').authenticate();

      const code: string = request.input('code');
      const clientId: string = Env.get('SPOTIFY_CLIENT_ID');
      const clientSecret: string = Env.get('SPOTIFY_CLIENT_SECRET');
      const redirectUri: string = `http://localhost:${Env.get('PORT')}/auth/spotify/callback`;

      const responseToken: AxiosResponse<any, any> = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        }
      });

      const accessToken: string = responseToken.data.access_token;
      const refreshToken: string = responseToken.data.refresh_token;

      const user = await User.find(auth.user!.id);
      user!.spotifyAccessToken = accessToken;
      user!.spotifyRefreshToken = refreshToken;
      await user!.save();

      return response.redirect('/app/home');
    } catch (error: any) {
      return response.status(301).redirect().toRoute('app.login.get');
    }
  }
}
