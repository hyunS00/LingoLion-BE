import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameColumnContentToDetailedFeedbackInFeedback1749276208286 implements MigrationInterface {
    name = 'RenameColumnContentToDetailedFeedbackInFeedback1749276208286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" RENAME COLUMN "content" TO "detailedFeedback"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD "message" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "feedback" RENAME COLUMN "detailedFeedback" TO "content"`);
    }

}
