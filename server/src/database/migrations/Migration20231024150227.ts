import { Migration } from '@mikro-orm/migrations';

export class Migration20231024150227 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" drop constraint "post_thread_id_thread_title_foreign";');

    this.addSql('alter table "thread" alter column "id" type int using ("id"::int);');
    this.addSql('alter table "thread" drop constraint "thread_pkey";');
    this.addSql('create sequence if not exists "thread_id_seq";');
    this.addSql('select setval(\'thread_id_seq\', (select max("id") from "thread"));');
    this.addSql('alter table "thread" alter column "id" set default nextval(\'thread_id_seq\');');
    this.addSql('alter table "thread" add constraint "thread_pkey" primary key ("id");');

    this.addSql('alter table "post" drop column "thread_title";');
    this.addSql('alter table "post" add constraint "post_thread_id_foreign" foreign key ("thread_id") references "thread" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop constraint "post_thread_id_foreign";');

    this.addSql('alter table "thread" alter column "id" type int using ("id"::int);');
    this.addSql('alter table "thread" drop constraint "thread_pkey";');
    this.addSql('alter table "thread" alter column "id" drop default;');
    this.addSql('alter table "thread" add constraint "thread_pkey" primary key ("id", "title");');

    this.addSql('alter table "post" add column "thread_title" varchar(255) not null;');
    this.addSql('alter table "post" add constraint "post_thread_id_thread_title_foreign" foreign key ("thread_id", "thread_title") references "thread" ("id", "title") on update cascade;');
  }

}
