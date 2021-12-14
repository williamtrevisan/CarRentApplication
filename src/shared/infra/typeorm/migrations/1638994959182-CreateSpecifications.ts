import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSpecifications1638994959182 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "specifications",
        columns: [
          {
            name: "id",
            type: "varchar",
          },
          {
            name: "name",
            type: "varchar"
          },
          {
            name: "description",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("specifications");
  }
}
