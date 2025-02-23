import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveIsRevokedFromRefreshToken1740296256657
  implements MigrationInterface
{
  name = 'RemoveIsRevokedFromRefreshToken1740296256657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP COLUMN "isRevoked"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD "isRevoked" boolean NOT NULL`,
    );
  }
}
