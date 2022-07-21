# Duck Duck Docker -- A simple template for Docker integration with ExpressJS server

[![Apache](https://img.shields.io/badge/license-Apache-blue.svg)](https://github.com/gouravkhator/duck-duck-docker/blob/main/LICENSE.md)

This is a simple template, which showcases Docker integration with ExpressJS server, also using redis service.

## Scope

This repo:

- Covers the concepts of Dockerfile, docker compose, and how does multiple services inside docker compose interact with each other.
- Takes the case of only two services:
  - Server end
  - Redis Service
- Uses environment variables for docker environment, and for local running.
- Uses different layers of instructions for dev and prod in the Dockerfile.

## Commands

### Commands Using docker-compose

Run all the below commands from the root folder of this repo.

- Build and start the services using docker compose:

  ```sh
  # For development mode
  npm run docker:dev:build

  # OR, for production mode like below:
  npm run docker:prod:build
  ```

- Only run the already-built services:

  ```sh
  # For development mode
  npm run docker:dev:run

  # OR, for production mode like below:
  npm run docker:prod:run
  ```

  > NOTE: If we do `Ctrl+C` or `Ctrl+D` or `Ctrl+Z` after the docker-compose up commands, then it just stops the containers, but does not remove the containers.

- Shut down and remove the containers created using docker compose:

  ```sh
  # For development mode
  npm run docker:dev:down

  # OR, for production mode like below:
  npm run docker:prod:down
  ```

### Commands for Running Services Locally without docker-compose or docker

Below commands uses the `.env.local` environment file.

- Run the redis service:

  - The below command builds and creates the docker container from the redis official image.
  - Runs the container in the daemon in background and exposes the required ports.
  - Also, enables the remove container on stopped feature, so that once we stop this container, this container automatically gets removed.

  ```sh
  npm run redis:start
  ```

  > NOTE: `REDIS_PORT=6379 echo $REDIS_PORT` will not work on linux, giving us empty output.

  > NOTE: Similar to above echo command, `dotenv -e .env.local -- <commands with arguments>` tries to first read the `.env.local` file, and then exports the variables to the environment, but we cannot directly use the environment variables directly in the command given next to the dotenv cli.

  We have to either use some npm scripts and then give that npm script as the command next to the dotenv-cli. Npm scripts reads the exported variables and adds that in process.env object.

  So, the below also works:

  ```sh
  NODE_ENV=production npm start
  ```

  What we can do otherwise is to use bash script, with -c flag, to use the environment variables in the command.

  ```sh
  dotenv -e .env.local -- bash -c '<commands-with-arguments-and-variables>'
  ```

- Stop the redis service: Below command stops and also removes the created redis docker container.

  ```sh
  npm run redis:stop
  ```

- Run the server locally, without the docker:

  ```sh
  npm run server:start
  ```

  Or, We can also run from the server folder too, but then, we have to pass the environment in the command, as from the root folder, we used dotenv to load the environment variables from the file.

  ```sh
  cd server/
  PORT=8081 REDIS_HOST=localhost npm start
  ```

  > Note: This `server:start` command (without using docker), requires you to first install npm dependencies. You can run `npm run full-install` from your project root folder, for the same.

### Commands for Running Each Service Individually using docker command, without the central docker-compose

- Build the docker image:

  ```sh
  cd server/
  docker build --build-arg NODE_ENV=development --target server -t server .
  ```

- Run the container from the built image:

  ```sh
  docker run -it -d -p 8081:8081 --name myserver server
  ```
