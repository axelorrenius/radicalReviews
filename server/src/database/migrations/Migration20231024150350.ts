import { Migration } from '@mikro-orm/migrations';

export class Migration20231024150350 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "thread" drop constraint "thread_updated_by_id_foreign";');

    this.addSql('alter table "thread" alter column "updated_by_id" type int using ("updated_by_id"::int);');
    this.addSql('alter table "thread" alter column "updated_by_id" drop not null;');
    this.addSql('alter table "thread" add constraint "thread_updated_by_id_foreign" foreign key ("updated_by_id") references "user" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "thread" drop constraint "thread_updated_by_id_foreign";');

    this.addSql('alter table "thread" alter column "updated_by_id" type int using ("updated_by_id"::int);');
    this.addSql('alter table "thread" alter column "updated_by_id" set not null;');
    this.addSql('alter table "thread" add constraint "thread_updated_by_id_foreign" foreign key ("updated_by_id") references "user" ("id") on update cascade;');
  }

}
