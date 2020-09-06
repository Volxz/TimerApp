#!/bin/bash
set -ev
cd ${TRAVIS_BUILD_DIR}/client
npm install
npm run build