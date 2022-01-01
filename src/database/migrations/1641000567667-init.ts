import {MigrationInterface, QueryRunner} from "typeorm";

export class init1641000567667 implements MigrationInterface {
    name = 'init1641000567667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(255) NOT NULL, "role" text NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "file" character varying NOT NULL, "publish" boolean NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "UQ_af95ddf25e9bd491236781b1aef" UNIQUE ("name"), CONSTRAINT "UQ_54ddf9075260407dcfdd7248577" UNIQUE ("slug"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "file" character varying NOT NULL, "publish" boolean NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posts_categories" ("post_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_a2686167392213db0acf82f40cc" PRIMARY KEY ("post_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7aa2cc32acbe04ab0e196977a5" ON "posts_categories" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5f604036872bdb8981d298fe3c" ON "posts_categories" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts_categories" ADD CONSTRAINT "FK_7aa2cc32acbe04ab0e196977a56" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_categories" ADD CONSTRAINT "FK_5f604036872bdb8981d298fe3ce" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts_categories" DROP CONSTRAINT "FK_5f604036872bdb8981d298fe3ce"`);
        await queryRunner.query(`ALTER TABLE "posts_categories" DROP CONSTRAINT "FK_7aa2cc32acbe04ab0e196977a56"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f604036872bdb8981d298fe3c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7aa2cc32acbe04ab0e196977a5"`);
        await queryRunner.query(`DROP TABLE "posts_categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
