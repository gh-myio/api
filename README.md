# Creating migrations automatically

```sh
npx sequelize-mig migration:make --name=something
```

# Migrating existing databases:

```
CREATE TABLE public."SequelizeMeta"
(
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

INSERT INTO "SequelizeMeta"("name") VALUES (E'20190603175614-initial.js');

```
