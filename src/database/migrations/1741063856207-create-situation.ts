import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSituation1741063856207 implements MigrationInterface {
    name = 'CreateSituation1741063856207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "situation" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "situation" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "situation" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_4d1e0a2075efe37b9e81ff48b99"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "REL_4d1e0a2075efe37b9e81ff48b9"`);
        await queryRunner.query(`ALTER TABLE "situation" ADD CONSTRAINT "FK_18a9a346e5b54cd82cd8af99971" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_4d1e0a2075efe37b9e81ff48b99" FOREIGN KEY ("situationId") REFERENCES "situation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_c308b1cd542522bb66430fa860a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_c308b1cd542522bb66430fa860a"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_4d1e0a2075efe37b9e81ff48b99"`);
        await queryRunner.query(`ALTER TABLE "situation" DROP CONSTRAINT "FK_18a9a346e5b54cd82cd8af99971"`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "REL_4d1e0a2075efe37b9e81ff48b9" UNIQUE ("situationId")`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_4d1e0a2075efe37b9e81ff48b99" FOREIGN KEY ("situationId") REFERENCES "situation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "situation" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "situation" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "situation" ADD "type" character varying NOT NULL`);
    }

}
