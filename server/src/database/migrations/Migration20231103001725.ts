import { Migration } from '@mikro-orm/migrations';

export class Migration20231103001725 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "thread" drop constraint "thread_course_id_foreign";');

    this.addSql('alter table "thread" rename column "course_id" to "course_instance_id";');
    this.addSql('alter table "thread" add constraint "thread_course_instance_id_foreign" foreign key ("course_instance_id") references "course_instance" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "thread" drop constraint "thread_course_instance_id_foreign";');

    this.addSql('alter table "thread" rename column "course_instance_id" to "course_id";');
    this.addSql('alter table "thread" add constraint "thread_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade;');
  }

}
