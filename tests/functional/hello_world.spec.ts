import { test } from '@japa/runner';

test('Display login page', async ({ client }) => {
  const response = await client.get('/login');

  response.assertStatus(200);
});
