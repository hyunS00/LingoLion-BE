import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1740044967356 implements MigrationInterface {
  name = 'Init1740044967356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hashedSecret" character varying(255) NOT NULL, "isRevoked" boolean NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userId" uuid, CONSTRAINT "UQ_81a605338cb9d49f459e2cf7415" UNIQUE ("hashedSecret"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "role" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "id" SERIAL NOT NULL, "sender" character varying NOT NULL DEFAULT 'user', "content" character varying NOT NULL, "conversationId" integer NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "id" SERIAL NOT NULL, "title" character varying NOT NULL, "icon" character varying NOT NULL, "situationId" integer NOT NULL, CONSTRAINT "REL_4d1e0a2075efe37b9e81ff48b9" UNIQUE ("situationId"), CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`
            CREATE TABLE "situation" (
               "id" SERIAL NOT NULL,
               "place" character varying NOT NULL,
               "aiRole" character varying NOT NULL,
               "userRole" character varying NOT NULL,
               "goal" character varying NOT NULL,
               "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
               "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
               "version" integer NOT NULL,
               "type" character varying NOT NULL,
               "name" character varying NOT NULL,
               CONSTRAINT "PK_situation" PRIMARY KEY ("id")
            )
          `);
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD CONSTRAINT "FK_4d1e0a2075efe37b9e81ff48b99" FOREIGN KEY ("situationId") REFERENCES "situation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP CONSTRAINT "FK_4d1e0a2075efe37b9e81ff48b99"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`,
    );
    await queryRunner.query(`DROP TABLE "situation"`);
    await queryRunner.query(`DROP TABLE "conversation"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
  }
}
