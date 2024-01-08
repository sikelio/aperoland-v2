import { test } from '@japa/runner';

test('Display login page', async ({ client }) => {
	const response = await client.get('/auth/login');

	response.assertStatus(200);
});

test('Display register page', async ({ client }) => {
	const response = await client.get('/auth/register');

	response.assertStatus(200);
});
