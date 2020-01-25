#!/bin/bash
RESTORE='\033[0m'
RED='\033[00;31m'
GREEN='\033[00;32m'
YELLOW='\e[0;33m'

export PROJECT_NAME="umbriel"
export PROJECT_BASE=$(pwd)

function devhelp {
  echo -e "${RED}INSTRUÇÕES DE SETUP DO PROJETO DOCKERIZADO PARA DESENVOLVIMENTO${RESTORE}"
  echo -e ""
  echo -e "${GREEN}devhelp${RESTORE}                     Imprime este ${RED}help${RESTORE}"
  echo -e ""
  echo -e "${GREEN}dkbuild${RESTORE}                     ${RED}Cria a imagem docker${RESTORE} desse projeto"
  echo -e ""
  echo -e "${GREEN}dkup${RESTORE}                        ${RED}Sobe o ambiente${RESTORE} dockerizado completo attached"
  echo -e ""
  echo -e "${GREEN}dkdown${RESTORE}                      ${RED}Para todos os containers${RESTORE} desse projeto"
  echo -e ""
  echo -e "${GREEN}dkexec (app|tests) \"bla\"${RESTORE}    ${RED}Roda o comando${RESTORE} 'bla' dentro do container docker que você deseja"
  echo -e ""
}

function dkup {
  CD=$(pwd)
  cd $PROJECT_BASE
  docker-compose -f docker/docker-compose.yml up
  exitcode=$?
  cd $CD
  return $exitcode
}

function dkdown {
  CD=$(pwd)
  cd $PROJECT_BASE
  docker-compose -f docker/docker-compose.yml down
  exitcode=$?
  cd $CD
  return $exitcode
}

function dkbuild {
  CD=$(pwd)
  cd $PROJECT_BASE
  docker-compose -f docker/docker-compose.yml build
  exitcode=$?
  cd $CD
  return $exitcode
}

function dkexec {
  docker exec -it "${PROJECT_NAME}_$1" $2
  exitcode=$?
  return $exitcode
}

devhelp
