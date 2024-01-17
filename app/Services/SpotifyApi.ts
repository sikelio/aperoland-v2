import Env from '@ioc:Adonis/Core/Env';
import SpotifyWebApi from 'spotify-web-api-node';

const spotify: SpotifyWebApi = new SpotifyWebApi({
  clientId: Env.get('SPOTIFY_CLIENT_ID'),
  clientSecret: Env.get('SPOTIFY_CLIENT_SECRET'),
  redirectUri: `http://localhost:${Env.get('PORT')}/auth/spotify/callback`
});

export default spotify;
