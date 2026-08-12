const fs = require('fs');

let addresses = [""]//<--her your address 
let offlineTime = {};

//check your server:
async function checkServerAddess(){
  for(const address of addresses){
    try{
      let response = await fetch(address);

      //check if Server Online
      if(response.ok){
        checkOffTime(address);
        writeOn(address);
      }
      else{
        writeErr(address, new Error(`HTTP Status Code: ${response.status}`));
      }
    } catch(err){
        console.error("addess not online",err);
        writeErr(address,err);
      }
  }
}
// write error
function writeErr(address, err) {
  const logMessage = `[${new Date().toISOString()}] ERROR (${address}): ${err.message}\n`;
  fs.appendFileSync('log.txt', logMessage);

  if(!offlineTime[address]){
    offlineTime[address] = new Date();
  }
}
// write online
function writeOn(address) {
  const logMessage = `[${new Date().toISOString()}] ONLINE (${address})\n`;
  fs.appendFileSync('log.txt', logMessage);
}

//check log.txt if 10000 line
function checkLines(){
  if (!fs.existsSync('log.txt')) return;

  //read and count
  const content = fs.readFileSync('log.txt', 'utf8');
  const lineCount = content.split('\n').length;

  //if line 10000 his deleted all line
  if (lineCount >= 10000) {
    fs.writeFileSync('log.txt', '');
    console.log('All lines in log.txt has deleted');
  }
}
//check offline time
function checkOffTime(address){
  if(offlineTime[address]){
    const durationSeconds = Math.round((new Date() - offlineTime[address])/ 1000);
    const logMessage = `[${new Date().toISOString()}] RECOVERED (${address}): Server was offline for ${durationSeconds} seconds\n`;
    
    fs.appendFileSync('log.txt', logMessage)
    delete offlineTime[address];
  }
}

setInterval(checkLines,60000)//check the log lines all 60 seconds
setInterval(checkServerAddess, 30000)//<--her seconds in milliseconds what you want

//server start:
fs.appendFileSync('log.txt', `\n[${new Date().toISOString()}] Server has be start \n`)
console.log('Server Check has been started...')
