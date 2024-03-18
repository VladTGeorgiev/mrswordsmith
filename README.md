# Account Management API

This API provides functionality to interact with accounts.
It allows users to create, update, delete and get account information.

## Prerequisites

The API is build using [Node.js](https://nodejs.org/en) version 20.6.1.

## Configuration

### Environment variables

The API requires the following environment variables to be set:

- `PORT`
    - Number, which defines on which port the APi listens to
- `HEALTH_PORT`
    - Number, which defines on which port service health checks could be performed 
- `DATABASE_URL`
    - Database url
- `DATABASE_HEALTH_CHECK_SEC`
    - Database health check interval in seconds

The API reads the environment variables from a `.env` file. An example can be seen here [.env.example](.env.example)
Please create a `.env` file in the root of the project with the desired values.

## Database

The API relies on PostgreSQL data storage solution.

## Bootstrapping

### Installing dependencies

`npm run install`

### Building

[esbuild](https://esbuild.github.io/) is used to build the project. run: `npm run build`

## Developing

### API 

To start the API run `npm run dev:start:api`

### DB

To start the database run `npm run dev:start:db`

## Testing

Testing functionality is provided by [jest](https://jestjs.io/)

To run tests use: `npm run test`
