const fs = require('fs');
const path = require('path');
const readline = require('readline');

class WriteData {
	rl = null
	fpath = ""
	fst = true
	lst = true

//#############################################################################
constructor(fn){
	this.rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	this.fpath = path.resolve( __dirname, fn );					//	"../text.txt"
	this.writeData();
	this.procReadData();
}
//#############################################################################
procReadData() {
	  let q = "Hey! Write something: "
	  if(!this.fst){
		q = "Write something else: "
	  }
	this.rl.question( q, dt => {
	//	console.log("Hi "+name+"!");
		if( dt === "exit" ){
			process.exit();
		//	readline.close();
		}else{
		//	this.writeData( dt );
		}
		this.writeData( dt, true );
		this.fst = false;
		this.procReadData();
	});
	//+++++++++++++++++++++++++
	process.on('exit', (code) => {		//	beforeExit
		//	console.log("====	code = "+code+"!");
		if(this.lst){
			console.log("		");
			console.log("	Bye!	");
			this.lst = false;
		}
	});
}
//#############################################################################
writeData( dt = "", app = false ) {

	let writeStream = null;
	if(app){
		writeStream = fs.createWriteStream( this.fpath, {flags:'a'} );
		writeStream.write( dt+"\n", "UTF8" );
	}else{
		writeStream = fs.createWriteStream( this.fpath );
		writeStream.write( dt, "UTF8" );
	}

	//	let writeStream = fs.createWriteStream( this.fpath, {flags:'a'} );
	//	console.log( "Hey! Write something: " );
	//	writeStream.appendFile( dt, "UTF8" );
	//	writeStream.write( dt+"\n", "UTF8" );
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