const fs = require('fs');
const path = require('path');

class CSSAppend {
	fpath = ""
	tpath = ""
	out_fn = ""
	data = ""

//#############################################################################
constructor(from, to, fn){
	this.fpath = path.resolve( __dirname, from );
	this.tpath = path.resolve( __dirname, to );					//	"../text.txt"
	this.out_fn = fn;

	this.readFolder()
}
//#############################################################################
async readFolder() {
	try {
		const fp_write = path.join(this.tpath, this.out_fn );
		await this.writeNullFile( fp_write );
		//+++++++++++++
		const dir = await fs.promises.opendir( this.fpath, {withFileTypes: true} );
		
		for await (const dirent of dir){
			const ext = path.extname( dirent.name );
			if( dirent.isFile() && ext === ".css" ){
				const fp_read  = path.join(this.fpath, dirent.name );
				
				await this.copyFile( fp_read, fp_write );
			//	console.log( fp_read+" >>> "+fp_write );
				
			//	console.log(dirent.name);
			}
		}
		//+++++++++++++
	} catch (err) {
		console.error(err);
	}
}
//#############################################################################
//#############################################################################
copyFile( fp_read, fp_write ) {
	let dt = "";
	let readStream = fs.createReadStream( fp_read );
	readStream.setEncoding("UTF8");

	readStream.on("data", (chunk) => {
		dt += chunk;
	});
	
	readStream.on("end", () => {
	//	console.log( dt );
		if(dt != null){
			this.writeFile(fp_write, dt);
		}else{
			this.writeFile(fp_write);
		}
	//	console.log( dt );
	});
	
	readStream.on("error", (error) => {
		console.log( error.stack );
	});
}
//#############################################################################
readFile( fp ) {
	let dt = "";
	let readStream = fs.createReadStream( fp );
	readStream.setEncoding("UTF8");

	readStream.on("data", (chunk) => {
		dt += chunk;
	});
	
	readStream.on("end", () => {
		this.data = dt;
	//	console.log( this.data );
		return dt;
	});
	
	readStream.on("error", (error) => {
		console.log( error.stack );
	});
}
//#############################################################################
writeFile( fp, dt = "" ) {
	let writeStream = fs.createWriteStream( fp, {flags:'a'} );
	//	let writeStream = fs.createWriteStream( fp );

	writeStream.write( dt, "UTF8" );
	writeStream.end();

	writeStream.on("finish", () => {
	//	console.log("Finished writing");
	});

	writeStream.on("error", (error) => {
	//	console.log(error.stack);
	});
}
//#############################################################################
writeNullFile( fp, dt = "" ) {
	//	let writeStream = fs.createWriteStream( fp, {flags:'a'} );
	let writeStream = fs.createWriteStream( fp );

	writeStream.write( dt, "UTF8" );
	writeStream.end();

	writeStream.on("finish", () => {
	//	console.log("Finished writing");
	});

	writeStream.on("error", (error) => {
	//	console.log(error.stack);
	});
}
//#############################################################################
}
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
new CSSAppend("styles", "project-dist", "bundle.css");
