
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

nvm install 14

nvm alias default 14

## setup pandoc for reporting

wget  "https://github.com/jgm/pandoc/releases/download/2.17.1.1/pandoc-2.17.1.1-linux-amd64.tar.gz"; 
tar xvzf "pandoc-2.17.1.1-linux-amd64.tar.gz" --strip-components 1 -C ~

# Clone the project

git clone https://github.com/jsa2/EAST

cd EAST;
npm install

echo "cd EAST to use";

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

sleep 2;
exit;
