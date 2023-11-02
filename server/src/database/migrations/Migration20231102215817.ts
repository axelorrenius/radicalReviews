import { Migration } from '@mikro-orm/migrations';

export class Migration20231102215817 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "level" int not null default 0;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "level";');
  }

}
