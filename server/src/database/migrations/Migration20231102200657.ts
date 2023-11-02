import { Migration } from '@mikro-orm/migrations';

export class Migration20231102200657 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "course" alter column "description" type text using ("description"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "course" alter column "description" type varchar(255) using ("description"::varchar(255));');
  }

}
