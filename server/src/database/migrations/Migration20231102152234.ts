import { Migration } from '@mikro-orm/migrations';

export class Migration20231102152234 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "course_instance" ("id" serial primary key, "round_name" varchar(255) not null, "round_start" timestamptz(0) not null, "round_end" timestamptz(0) not null, "exam_date" timestamptz(0) null, "course_id" int not null);');

    this.addSql('create table "tag" ("id" serial primary key, "name" varchar(255) not null, "entity_type" int not null);');

    this.addSql('create table "tag_instance" ("id" serial primary key, "entity_id" int not null, "tag_id" int not null);');

    this.addSql('alter table "course_instance" add constraint "course_instance_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade;');

    this.addSql('alter table "tag_instance" add constraint "tag_instance_tag_id_foreign" foreign key ("tag_id") references "tag" ("id") on update cascade;');

    this.addSql('alter table "user_course" drop constraint "user_course_course_id_foreign";');

    this.addSql('alter table "user" add column "experience" int not null default 0, add column "description" varchar(255) null;');
    this.addSql('alter table "user" alter column "phone_number" type varchar(255) using ("phone_number"::varchar(255));');
    this.addSql('alter table "user" alter column "phone_number" drop not null;');
    this.addSql('alter table "user" drop column "salt";');

    this.addSql('alter table "user_course" add constraint "user_course_course_id_foreign" foreign key ("course_id") references "course_instance" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_course" drop constraint "user_course_course_id_foreign";');

    this.addSql('alter table "tag_instance" drop constraint "tag_instance_tag_id_foreign";');

    this.addSql('drop table if exists "course_instance" cascade;');

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('drop table if exists "tag_instance" cascade;');

    this.addSql('alter table "user_course" drop constraint "user_course_course_id_foreign";');

    this.addSql('alter table "user" add column "salt" varchar(255) not null;');
    this.addSql('alter table "user" alter column "phone_number" type varchar(255) using ("phone_number"::varchar(255));');
    this.addSql('alter table "user" alter column "phone_number" set not null;');
    this.addSql('alter table "user" drop column "experience";');
    this.addSql('alter table "user" drop column "description";');

    this.addSql('alter table "user_course" add constraint "user_course_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade;');
  }

}
