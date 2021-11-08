const fs = require('fs');
const path = require('path');
const readline = require('readline');

class WriteData {
	rl = null
	fpath = ""
	data = "Data for test write!"

//#############################################################################
constructor(fn){
	this.rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	this.fpath = path.resolve( __dirname, fn );					//	"../text.txt"
	this.procReadData();
}
//#############################################################################
procReadData() {
/*	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});*/
	  
	this.rl.question("Hey! Write something: ", dt => {
	//	console.log("Hi "+name+"!");
		if( dt === "exit" ){
			readline.close();
		}else{
			this.writeData( dt );
		}
	});
	//+++++++++++++++++++++++++
	process.on('exit', (code) => {		//	beforeExit
		console.log("====	code = "+code+"!");
	});
}
//#############################################################################
writeData( dt = this.data ) {

	let writeStream = fs.createWriteStream( this.fpath, {flags:'a'} );
	//	console.log( "Hey! Write something: " );
	//	writeStream.appendFile( dt, "UTF8" );
	writeStream.write( dt+"\n", "UTF8" );
	writeStream.end();

	writeStream.on("finish", () => {
	//	this.procReadData();
	//	console.log("Finished writing");
	});

	writeStream.on("error", (error) => {
	//	console.log(error.stack);
	});

}
//#############################################################################
}
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
new WriteData("text.txt");