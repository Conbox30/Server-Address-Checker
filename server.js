const fs = require('fs');

let addresses = [""]//<--her your address 

//check your server:
async function checkServerAddess(){
  for(const address of addresses){
    try{
      let response = await fetch(address);

      //check if Server Online
      if(response.ok){
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
}
// write online
function writeOn(address) {
  const logMessage = `[${new Date().toISOString()}] ONLINE (${address})\n`;
  fs.appendFileSync('log.txt', logMessage);
}

setInterval(checkServerAddess, 5000)//her seconds in milliseconds
console.log('Server Check has been started...')