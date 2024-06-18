This is a Event-driven-architecture proof of concept using Kafka and Nats in open-api 3.0.0 using NodeJS and Typescript.
This is a simple User CRUD with a event-driven architecture project which deals with user records.

## Technologies Requirements

- Docker needs to be installed
- NodeJS needs to be installed
- Yarn needs to be installed

## Technologies Used

- NodeJS
- Typescript
- Kafka
- Nats
- Docker

## How to run

- Clone this repository
- Run `docker compose up` at this root directory level to start the kafka and nats containers
- Run `yarn install`at the "/data_service" directory level to install the dependencies for the data service
- Run `yarn dev` at the "/data_service" directory level to start the data service
- Run `yarn install`at the "/restapi" directory level to install the dependencies for the user microservice(restAPI)
- Run `yarn generate` at the "/restapi" directory level to generate the open-api typescript files
- Run `yarn dev` at the "/restapi" directory level to start the user microservice(restAPI)

## How to use

- After running the restAPI, you can access the swagger documentation at http://localhost:8080/docs
