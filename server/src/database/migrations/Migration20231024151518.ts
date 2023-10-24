import { Migration } from '@mikro-orm/migrations';

export class Migration20231024151518 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "thread" add column "up_votes" int not null default 0, add column "down_votes" int not null default 0;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "thread" drop column "up_votes";');
    this.addSql('alter table "thread" drop column "down_votes";');
  }

}
