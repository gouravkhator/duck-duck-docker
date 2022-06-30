# Docker Demo -- For Learning Purpose Only

## Scope

This repo:
- Covers the concepts of Dockerfile, docker compose, and how does multiple services inside docker compose interact with each other.
- Takes the case of only two services:
  - Server end
  - Redis Service
- Uses environment variables for docker environment, and for local running.
- Uses different layers of instructions for dev and prod in the Dockerfile.

## Commands
---
---

### Commands Using docker-compose
---

Run all the below commands from the root folder of this repo.

- Build and start the services using docker compose:

  ```sh
  docker-compose --env-file .env.docker up --build
  ```

- Only run the already-built services:

  ```sh
  docker-compose --env-file .env.docker up
  ```

  > NOTE: If we do `Ctrl+C` after the docker-compose up commands, then it just stops the containers, but does not remove the containers. 

- Shut down and remove the containers created using docker compose:

  ```sh
  docker-compose --env-file .env.docker down
  ```

- For passing environments inside docker containers, we have two ways:

  1. Steps to integrate the 1st way:
  
      I) Make sure to have the environment keys in the docker compose, in the services for which those environment variables would be consumed.

        ```yml
        services:
          backend:
            image: stran-backend
            container_name: backend
            environment:
              - SERVER_PORT
              - REDIS_HOST
            build:
              context: ./server
        ```

      II) Pass the environment file name in the docker-compose command like below.

        ```sh
        docker-compose --env-file .env.docker up --build
        ```

      Here, downside is we have to pass every environment variable key name to the docker-compose file, and then have the environment file name in the command.
      
  2. Steps to integrate the 2nd way:

      I) Just Pass the environment file name in every service in the docker compose file, for which we want to use the environments.

        ```yml
        services:
          backend:
            image: stran-backend
            container_name: backend
            env_file:
              - ./.env.docker
        ```

      This way, we can just pass the environment variables file, to each service for which we want to use the environments.

      > NOTE: I am still looking for ways, if we can globally pass the environment variable file for all the services in the docker compose.

- Why the `.env.docker` file is passed in two places in our case, once in the command line with docker-compose command, and also in the docker-compose yaml file?

  - It is bcoz, the `.env.docker` file passed in the command line with the docker-compose command is for using the environment keys in the docker-compose itself like below:

    ```yml
    services:
      redis-server:
        container_name: redis-server
        image: redis
        ports:
          - "$REDIS_PORT:$REDIS_PORT"
    ```

    Or if we want to use the environment in the containers, we have to tell docker that we want to pass the specific environment keys, and so there also, we have to pass the `.env.docker` in the command line.

    ```yml
    services:
      backend:
        image: stran-backend
        container_name: backend
        environment:
          - SERVER_PORT
          - REDIS_HOST
        build:
          context: ./server
    ```

  - If we want to consume the environment inside docker containers, then irrespetive of passing the environment file in the command line, we also have to pass in the section of each of the services in docker compose file.

    ```yml
    services:
      backend:
        image: stran-backend
        container_name: backend
        env_file:
          - ./.env.docker
    ```

### Commands for Running Services Locally without docker-compose or docker
---

Below commands uses the `.env.local` environment file.

- Run the redis service: (as this is the redis server, and I have used docker base redis image for this)

  - Builds and creates the docker container from the redis official image.
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

- Stop the redis service

  - Below command stops and also removes the created redis docker container

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

---
---


### Commands for Running Each Service Individually using docker command, without the central docker-compose
---

- Build the docker image:

  ```sh
  cd server/
  docker build --build-arg NODE_ENV=development --target server -t server .
  ```

- Run the container from the built image:

  ```sh
  docker run -it -d -p 8081:8081 --name myserver server
  ```

---
---

## Extra Notes to Keep in Mind

