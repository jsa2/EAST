
{ # try

az account clear
rm plugins/session/graphToken.json 
rm plugins/session/sessionToken.json 
rm plugins/session/aadToken.json
rm plugins/session/iamToken.json
    #save your output

} || { # catch
    echo "no tokens to destroy"
}


git config --global user.name "Your Name"
git checkout --orphan temp; git add .; git commit -m "s"