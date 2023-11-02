import { Migration } from '@mikro-orm/migrations';

export class Migration20231102185149 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "school" add column "image_url" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "school" drop column "image_url";');
  }

}
