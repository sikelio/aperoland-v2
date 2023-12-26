import { test } from '@japa/runner';

test('Display app home page', async ({ client }) => {
  const response = await client.get('/app/home');

  response.assertStatus(200);
});

test('Display app add event page', async ({ client }) => {
  const response = await client.get('/app/add-event');

  response.assertStatus(200);
});
