const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({extended:false});
var nameFile, response;
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
function uploadFile(auth){
    const drive = google.drive('v3');
    const filesMetadata = {
        'name': nameFile
    }
    const media = {
        body: fs.createReadStream("./public/upload/"+nameFile)
    }
    drive.files.create({
        auth:auth,
        resource: filesMetadata,
        media:media,
        fields: 'id'
    },(err,file)=>{
        if (err) console.log(err);
        else {
            drive.permissions.create({
                auth:auth,
                fileId: file.data.id,
                resource:{
                    role:"reader",
                    type:"anyone"
                }}, function(err,result){
              });
              let path = "./public/upload/"+nameFile;
              fs.unlink(path,(err)=>{
                  if (err) console.log(err);
              })
              response.json({success:1,idFile: file.data.id, name:nameFile}); 
        }      
    })

}
module.exports = function(app){
    app.post("/uploadToDrive",parser,(req,res)=>{
        nameFile = req.body.name;
        console.log(nameFile);
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);       
            response = res;
            authorize(JSON.parse(content), uploadFile);
          });
    })
}