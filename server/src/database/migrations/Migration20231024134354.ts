import { Migration } from '@mikro-orm/migrations';

export class Migration20231024134354 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "school" ("id" serial primary key, "school_name" varchar(255) not null, "description" varchar(255) not null);');

    this.addSql('create table "course" ("id" serial primary key, "course_name" varchar(255) not null, "description" varchar(255) not null, "school_id" int not null);');

    this.addSql('create table "user" ("id" serial primary key, "username" varchar(255) not null, "email" varchar(255) not null, "phone_number" varchar(255) not null, "password" varchar(255) not null, "salt" varchar(255) not null, "program_description" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "school_id" int not null);');

    this.addSql('create table "thread" ("id" int not null, "title" varchar(255) not null, "content" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "created_by_id" int not null, "updated_by_id" int not null, "course_id" int not null, constraint "thread_pkey" primary key ("id", "title"));');

    this.addSql('create table "post" ("id" serial primary key, "content" text not null, "up_votes" int not null default 0, "down_votes" int not null default 0, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "created_by_id" int not null, "thread_id" int not null, "thread_title" varchar(255) not null);');

    this.addSql('create table "comment" ("id" serial primary key, "content" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "created_by_id" int not null, "post_id" int not null);');

    this.addSql('create table "user_course" ("id" serial primary key, "user_id" int not null, "course_id" int not null, "enrolled_date" timestamptz(0) not null, "role" varchar(255) not null);');

    this.addSql('alter table "course" add constraint "course_school_id_foreign" foreign key ("school_id") references "school" ("id") on update cascade;');

    this.addSql('alter table "user" add constraint "user_school_id_foreign" foreign key ("school_id") references "school" ("id") on update cascade;');

    this.addSql('alter table "thread" add constraint "thread_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "thread" add constraint "thread_updated_by_id_foreign" foreign key ("updated_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "thread" add constraint "thread_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade;');

    this.addSql('alter table "post" add constraint "post_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "post" add constraint "post_thread_id_thread_title_foreign" foreign key ("thread_id", "thread_title") references "thread" ("id", "title") on update cascade;');

    this.addSql('alter table "comment" add constraint "comment_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');

    this.addSql('alter table "user_course" add constraint "user_course_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "user_course" add constraint "user_course_course_id_foreign" foreign key ("course_id") references "course" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "course" drop constraint "course_school_id_foreign";');

    this.addSql('alter table "user" drop constraint "user_school_id_foreign";');

    this.addSql('alter table "thread" drop constraint "thread_course_id_foreign";');

    this.addSql('alter table "user_course" drop constraint "user_course_course_id_foreign";');

    this.addSql('alter table "thread" drop constraint "thread_created_by_id_foreign";');

    this.addSql('alter table "thread" drop constraint "thread_updated_by_id_foreign";');

    this.addSql('alter table "post" drop constraint "post_created_by_id_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_created_by_id_foreign";');

    this.addSql('alter table "user_course" drop constraint "user_course_user_id_foreign";');

    this.addSql('alter table "post" drop constraint "post_thread_id_thread_title_foreign";');

    this.addSql('alter table "comment" drop constraint "comment_post_id_foreign";');

    this.addSql('drop table if exists "school" cascade;');

    this.addSql('drop table if exists "course" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "thread" cascade;');

    this.addSql('drop table if exists "post" cascade;');

    this.addSql('drop table if exists "comment" cascade;');

    this.addSql('drop table if exists "user_course" cascade;');
  }

}
