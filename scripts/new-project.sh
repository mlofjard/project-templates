#!/bin/bash

function tryrun {
    MESSAGE=$("$@" 2>&1)
    local exitcode=$?
    if [ $exitcode -ne 0 ]; then
        echo " - FAILED"
        echo "$MESSAGE" | sed "s/^/     /"
    else
    	echo " - SUCCESS"
    fi
    return $exitcode
}

function cleanupandexit {
	if [ $? -ne 0 ]; then
      echo -e " * Cleaning up"
      rm -r "$PROJECT_DIR"
      exit 1
    fi
}

if [ $# = 2 ]; then
  START_DIR="$(pwd)"
  PROJECT_NAME="$1"
  PROJECT_DIR="$(pwd)/$PROJECT_NAME"
  PROJECT_TYPE="$2"
  TEMPLATE_DIR="$(dirname $(dirname $(readlink -f "$0")))"
  
  case $PROJECT_TYPE in
    nodejs)
    ;;
    rust)
    ;;
    *)
	echo "ERROR: Unknown project type"
    exit 1
    ;;
  esac

  echo "--------------"
  echo "Project name:      $PROJECT_NAME"
  echo "Project directory: $PROJECT_DIR"
  echo "Project type:      $PROJECT_TYPE"
  #echo "Template directory: $TEMPLATE_DIR"
  echo "--------------"
  read -s -p "Proceed [Y/n]" -n 1 PROCEED
  echo
  if [[ "$PROCEED" =~ [Yy] || "$PROCEED" = "" ]]; then
    echo -n " * Creating project directory"
    tryrun mkdir "$PROJECT_DIR"
    # Cleanup and exit
    if [ $? -ne 0 ]; then
      exit 1
    fi
    
    echo -n " * Cloning project template"
    tryrun rsync -az --exclude=node_modules "$TEMPLATE_DIR/$PROJECT_TYPE/" "$PROJECT_DIR"
    # Cleanup and exit
    cleanupandexit

    echo " * Running project type specific init scripts"
    "$TEMPLATE_DIR"/scripts/init-"$PROJECT_TYPE".sh "$PROJECT_NAME" "$PROJECT_DIR"
    cleanupandexit

    echo -e "\nDone\n"
  else
    exit 1
  fi
else
  echo "USAGE: new-project.sh PROJECT_NAME PROJECT_TYPE"
  exit 1
fi