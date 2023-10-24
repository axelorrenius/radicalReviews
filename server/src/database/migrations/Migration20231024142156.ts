import { Migration } from '@mikro-orm/migrations';

export class Migration20231024142156 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "course" add column "course_code" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "course" drop column "course_code";');
  }

}
