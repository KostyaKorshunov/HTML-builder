const fs = require('fs');
const path = require('path');

class ReadData {
	fpath = ""
	data = ""

//#############################################################################
constructor(fn){
	this.fpath = path.resolve( __dirname, fn );					//	"../text.txt"
	this.readData();
}
//#############################################################################
readData() {

	let readStream = fs.createReadStream( this.fpath );
	readStream.setEncoding("UTF8");

	readStream.on("data", (chunk) => {
		this.data += chunk;
	});
	
	readStream.on("end", () => {
		console.log( this.data );
	});
	
	readStream.on("error", (error) => {
		console.log( error.stack );
	});

}
//#############################################################################
}
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
new ReadData("text.txt");
