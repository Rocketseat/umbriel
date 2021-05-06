#!/bin/bash
#### Try to Improve this code as a CLI Tool
CLEAN="clean"
RUN="run"
STOP="stop"

if [ "$#" -eq 0 ] || [ $1 = "-h" ] || [ $1 = "--help" ]; then
    echo "Usage: ./app [OPTIONS] COMMAND [arg...]"
    echo "       ./app [ -h | --help ]"
    echo ""
    echo "Options:"
    echo "  -h, --help    Prints usage."
    echo ""
    echo "Commands:"
    echo "  $CLEAN      - Stop and Remove umbriel containers."
    echo "  $RUN        - Build and Run umbriel Stack."
    echo "  $STOP       - Stop umbriel."
    exit
fi

clean() {
  stop_existing
  remove_stopped_containers
  remove_unused_volumes
}

run() {
  echo "Cleaning..."
  clean
  
  echo "Running docker..."
  docker-compose up --build
}

stop_existing() {
  SERVER="$(docker ps --all --quiet --filter=name=umbriel-server)"
  REDIS="$(docker ps --all --quiet --filter=name=umbriel-redis)"
  MONGO="$(docker ps --all --quiet --filter=name=umbriel-mongo)"

  if [ -n "$SERVER" ]; then
    docker stop $SERVER
  fi

  if [ -n "$REDIS" ]; then
    docker stop $REDIS
  fi

  if [ -n "$MONGO" ]; then
    docker stop $MONGO
  fi
}

remove_stopped_containers() {
  CONTAINERS="$(docker ps -a -f status=exited -q)"
	if [ ${#CONTAINERS} -gt 0 ]; then
		echo "Removing all stopped containers."
		docker rm $CONTAINERS
	else
		echo "There are no stopped containers to be removed."
	fi
}

remove_unused_volumes() {
  CONTAINERS="$(docker volume ls -qf dangling=true)"
	if [ ${#CONTAINERS} -gt 0 ]; then
		echo "Removing all unused volumes."
		docker volume rm $CONTAINERS
	else
		echo "There are no unused volumes to be removed."
	fi
}

if [ $1 = $CLEAN ]; then
  echo "Cleaning..."
	clean
	exit
fi

if [ $1 = $RUN ]; then
	run
	exit
fi

if [ $1 = $STOP ]; then
	stop_existing
	exit
fi