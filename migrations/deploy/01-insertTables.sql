-- Deploy orando:01-insertTables to pg

BEGIN;
-- Permet de créer un champ personnalisé de verification de l'email grâce au regex 
CREATE DOMAIN "email" AS text
CHECK (
    value ~ '(?:[a-z0-9!#$%&''*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&''*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])'
);

CREATE TABLE "users" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nickname" TEXT NOT NULL UNIQUE,
    "localisation" TEXT,
    "email" email UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "hikes" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"title" TEXT NOT NULL,
	"description" TEXT NOT NULL,
	"picture" TEXT[] NOT NULL,
	"difficulty" TEXT NOT NULL,
	"time" INT,
	"distance" NUMERIC NOT NULL,
	"localisation" TEXT NOT NULL,
	"details" TEXT NOT NULL,
	"gps_coordinate" GEOMETRY(LINESTRING, 4326),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "users_has_hikes" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "users_id" INTEGER REFERENCES "users"("id"),
    "hikes_id" INTEGER REFERENCES "hikes"("id"),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ
);

COMMIT;