# Users management app

> App requires [**docker-compose**](https://docs.docker.com/compose/)

App contains 3 microserveces built with [Hydra-Express](https://www.hydramicroservice.com/). Every single microservice is run inside docker container.

**MongoDB** is used for storing users. Runs inside docker container.

**Redis** is used for Hydra purposes. Runs inside Docker container.

API documentation available [here](https://documenter.getpostman.com/view/1184597/S1EKyzS8) 

#### To start the app, just run the following terminal command in project root directory:
```
docker-copmose up -d
```