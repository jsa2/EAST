
## setup pandoc for reporting

wget  "https://github.com/jgm/pandoc/releases/download/2.17.1.1/pandoc-2.17.1.1-linux-amd64.tar.gz"; 
tar xvzf "pandoc-2.17.1.1-linux-amd64.tar.gz" --strip-components 1 -C ~

# Clone the project

git clone https://github.com/jsa2/EAST --branch preview

cd EAST;
npm install

