import { Migration } from '@mikro-orm/migrations';

export class Migration20231024141759 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_school_id_foreign";');

    this.addSql('alter table "user" alter column "program_description" type varchar(255) using ("program_description"::varchar(255));');
    this.addSql('alter table "user" alter column "program_description" drop not null;');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "user" alter column "updated_at" drop not null;');
    this.addSql('alter table "user" alter column "school_id" type int using ("school_id"::int);');
    this.addSql('alter table "user" alter column "school_id" drop not null;');
    this.addSql('alter table "user" add constraint "user_school_id_foreign" foreign key ("school_id") references "school" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_school_id_foreign";');

    this.addSql('alter table "user" alter column "program_description" type varchar(255) using ("program_description"::varchar(255));');
    this.addSql('alter table "user" alter column "program_description" set not null;');
    this.addSql('alter table "user" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "user" alter column "updated_at" set not null;');
    this.addSql('alter table "user" alter column "school_id" type int using ("school_id"::int);');
    this.addSql('alter table "user" alter column "school_id" set not null;');
    this.addSql('alter table "user" add constraint "user_school_id_foreign" foreign key ("school_id") references "school" ("id") on update cascade;');
  }

}
