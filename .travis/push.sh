#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git checkout -b release-build
  git add dist
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote add origin-rb https://${GH_TOKEN}@github.com/Volxz/TimerFrontend.git > /dev/null 2>&1
  git push --quiet --set-upstream origin-rb release-build
}

setup_git
commit_website_files
upload_files