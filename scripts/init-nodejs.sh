#!/bin/bash

function tryrun {
    MESSAGE=$("$@" 2>&1)
    local exitcode=$?
    if [ $exitcode -ne 0 ]; then
        echo " - FAILED"
        echo "$MESSAGE" | sed "s/^/       /"
    else
    	echo " - SUCCESS"
    fi
    return $exitcode
}

function exitonerror {
	if [ $? -ne 0 ]; then
      exit 1
    fi
}

function secho {
	echo -en "$@" | sed "s/^/   * /"
}

START_DIR="$(pwd)"
PROJECT_NAME="$1"
PROJECT_DIR="$2"

cd $PROJECT_DIR

secho "Setting up package.json"
tryrun npm init -y
exitonerror

secho "Installing dependencies\n"
npm update --save
exitonerror
npm update --save-dev
exitonerror

cd $START_DIR

exit 0