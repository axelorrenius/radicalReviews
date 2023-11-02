import { Migration } from '@mikro-orm/migrations';

export class Migration20231102191319 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "school" add column "location" varchar(255) null;');

    this.addSql('alter table "user" add column "avatar" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "school" drop column "location";');

    this.addSql('alter table "user" drop column "avatar";');
  }

}
