# book review - back end

## Run in local machine

You can run your local machine with prerequisite of an installed or cloud uri for mongodb.

- Create a .env file in the root folder with the following variables

```bash
ENV=DEV

SERVER_PORT=6969

MONGODB_URL=mongodb://127.0.0.1:27017/
MONGODB_DBNAME=book-review-db
MONGODB_USER=root
MONGODB_PASSWORD=example

CLUSTER_MODE='off'
```

## Run with docker

- Prerequisite with a installed and running docker daemon.

- Run the following command in the in the root folder to start the dev server.

```bash
docker compose up &
```

---

Current status of implemented table could be found in ./docs/db.dbml
