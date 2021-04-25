# Umbriel

Batch mailing with Node.js & Amazon SES.

## Application Commands

   # *Backend Server Commands*
 - `./app.sh run` start all supporting running docker backend stacks
 - `npm install && npm run install` in main directory
 - `cd packages && cd server && npm run install` in packages directories
 - `cp .env.example .env` make sure copy or update your running enviroment variables with correct keys
 - `npm run dev` for dev stack running make sure your enviroment variables are configure properly
 - `npm run start` for production running

    # *Front-End Server Commands*
 - `cd web` redirect to web front end path
 - `npm install` install all packages
 - `npm run start` start your front-end stack make sure your back-end stack is running well

   ## *Docker Commands with bash*

 - * `./app.sh run` for run all the stack please make sure your enviroment variables are updated
 - * `./app.sh stop` for stop all running application and stack
 - * `./app.sh clean` for clean volume data and container images from local system
 - * `./app.sh -h | --help` for more help
 - * `./app [OPTIONS] COMMAND [arg...]` command running syntax