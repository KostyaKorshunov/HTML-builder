const fs = require('fs');
const path = require('path');

class CopyFolder {
	fpath = ""
	tpath = ""
	data = ""

//#############################################################################
constructor(from, to){
	this.fpath = path.resolve( __dirname, from );
	this.tpath = path.resolve( __dirname, to );					//	"../text.txt"

	//	this.mkFolder( this.tpath );
	this.readFolder()
}
//#############################################################################
async readFolder() {
	try {
		//	this.mkFolder( this.tpath );
	//	let isF = false;
	//	await fs.access( this.tpath , error => {
	//		if (!error) 	isF = true;	
	//	});
		
	//	if( isF ) {
	//	fs.rmdir( this.tpath, { recursive: true, force: true }, (err) => {
	//			if(err) console.log( "Error:rem Folder: "+err );
	//			console.log( "====	====	remove Dir	====	====" );
	//		});
	//	}
//	await this.rmFolder().then( async ()=> {
//		this.mkFolder().then( async ()=> {
		await this.mkFolder( this.tpath );
		//+++++++++++++
		const dir = await fs.promises.opendir( this.fpath, {withFileTypes: true} );
		
		for await (const dirent of dir){
			if( dirent.isFile() ){
				const fp_read  = path.join(this.fpath, dirent.name);
				const fp_write = path.join(this.tpath, dirent.name);

				await this.copyFile( fp_read, fp_write );
			//	const f_dt = await this.readFile( fp_read );
			//	this.writeFile( fp_write, f_dt );
			//	this.writeFile( fp_write, await this.readFile( fp_read ) );
				console.log( fp_read+" >>> "+fp_write );
			//	console.log(dirent.name);
			}
		}
		//+++++++++++++
//	});	
//	});
	} catch (err) {
		console.error(err);
	}
}
//#############################################################################
mkFolder( d_path = this.tpath ) {
	return new Promise((resolve, reject) => {
	fs.access( d_path , error => {
		if (!error) {
		//	fs.rmdir( d_path, { recursive: true, force: true }, (err) => {
		//		if(err) console.log( "Error:rem Folder: "+err );
		//		console.log( "====	====	remove Dir	====	====" );
		//	});		
		}
	});
		fs.mkdir( d_path, { recursive: true }, (err) => {
				if(err)	console.log( "Error:mk Folder: "+err );
				console.log( "====	====	Create Dir		====	====" );
		});
				
		resolve("");
	});
}
//#############################################################################
copyFile( fp_read, fp_write ) {
	let dt = null;
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
	let dt = null;
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
new CopyFolder("files", "files-copy");
