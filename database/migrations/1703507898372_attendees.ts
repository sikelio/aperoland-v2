import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
	protected tableName = 'attendees';

	public async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.charset('utf8');

			table.engine('InnoDB');

			table.collate('utf8_unicode_ci');

			table
				.integer('user_id')
				.unsigned()
				.references('user_id')
				.inTable('users')
				.onDelete('CASCADE');

			table
				.integer('event_id')
				.unsigned()
				.references('event_id')
				.inTable('events')
				.onDelete('CASCADE');

			table.unique(['user_id', 'event_id']);

			table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
		});
	}

	public async down() {
		this.schema.dropTable(this.tableName);
	}
}
