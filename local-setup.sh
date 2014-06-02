#!/bin/bash

# Setup of Phonegap and required modules for phonegap migration.
# Requires Node http://nodejs.org/

# dependencies: file containing a list of all modules required for migration from older Phonegap versions.
module_list_file="phonegap-migration-modules.txt"

# check if node is installed. 
if ! hash node 2>/dev/null; then
  printf >&2 "I require node but it's not installed.\nInstall it from http://nodejs.org/\n"
  exit 1
fi

# if the phonegap npm module isn't installed, install it
if ! hash cordova 2>/dev/null; then

  read -p "Phonegap module not installed. Install it globally (requires password)? " -n 1 -r
  echo    # (optional) move to a new line
  if [[ $REPLY =~ ^[Yy]$ ]] 
  then
    sudo npm install -g phonegap
    echo >&2 "Installing phonegap module globally..."
  else 
    echo "This requires the phonegap npm module. Installation instructions here: http://phonegap.com/install/"
    exit 1
  fi
fi

# rename our directory in preparation for it being moved.
mv www www-temp

echo "************"
echo "creating ohmage Phonegap project in current directory..."
echo "************"
cordova create temp org.ucla.ohmage ohmage

# Remove auto-generated www directory, replace with ours
rm -R temp/www
mv www-temp temp/www

# Remove auto-generated config.xml, replace with ours
rm temp/config.xml
mv config.xml temp/config.xml

echo "************"
echo "adding iOS platform to project..."
echo "************"
cd temp
cordova platform add ios

# Remove auto-generated iOS platform Resources directory, replace with ours
rm -R platforms/ios/ohmage/Resources
cd ..
mv platforms/ios/ohmage/Resources temp/platforms/ios/ohmage/Resources

# move the contents of temp into current directory
cp -R temp/. .

rm -R temp


# gets the list of plugin modules to install from our text file.
modules=( `cat $module_list_file | tr '\n' ' '` )

echo "************"
echo "installing modules..."
echo "************"
for module in "${modules[@]}"; do
  cordova plugin add "$module"
done

echo "************"
echo "Setup complete. Build with:"
echo "cordova build ios"
echo "************"