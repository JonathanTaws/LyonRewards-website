#!/bin/bash

PATHSCRIPT=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

if [ ! -f $PATHSCRIPT/scriptparameters ]
then
    echo "The file 'scriptparameters' in the path '$PATHSCRIPT' is not present."
    echo "Without this file, the script can't run apply the right rules."
    echo "Scriptparameters exemple :"
    echo '  SOURCEDIR=src'
    echo '  SCRIPTDIR=scripts'
    echo '  APACHEUSER=www-data'
    echo '  APACHEGROUP=www-data'
    echo '  SCRIPTDEBUG=false'
    echo '  PROJECTROOTDIR=/var/www/gp-insa'
    echo '  USER=gp-insa'
    echo '  GROUP=gp-insa'
    exit 1
fi

. $PATHSCRIPT/scriptparameters

npm() {
    ssh lyonrewards-lxc "cd ${PROJECTROOTDIR} && npm $1"
}

$1 $2