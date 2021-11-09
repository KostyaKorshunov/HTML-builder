const fs = require('fs');
const path = require('path');

class HTMLBuilder {
	fpath = ""
	tpath = ""
	path_css = ""
	path_ass = ""
	path_tmpl = ""
	tmpl_fn = "template.html"
	html_fn = "index.html"
	css_fn = "style.css"
	ass_dir = "assets"
	data = ""

//#############################################################################
constructor(from, from_css, from_ass, to ){
	this.path_css = path.resolve( __dirname, from_css );
	this.path_ass = path.resolve( __dirname, from_ass );
	this.fpath = path.resolve( __dirname, from );
	this.tpath = path.resolve( __dirname, to );					//	"../text.txt"
	this.path_tmpl = path.resolve( __dirname, this.tmpl_fn );

	this.createHTML();
}
//#############################################################################
createHTML() {
	this.readCSS();
	//++++++++++++++++++++++++++
	const main = async ()=>{
		const tmpl = await this.readFile( this.path_tmpl );
		let htm = tmpl;
		const dir = await fs.promises.opendir( this.fpath, {withFileTypes: true} );
		
		for await (const dirent of dir){
			if( dirent.isFile() ){
				const fn = path.basename( dirent.name, path.extname( dirent.name ) );
				const dt = await this.readFile( path.join(this.fpath, dirent.name) );
				const regE = new RegExp("{{"+fn+"}}", 'g' );
				htm = htm.replace( regE, dt );
			//	console.log( htm );
			//	console.log("====		====		====		====");
			//	console.log(dirent.name);
			}
		}
		//	console.log( htm );
		this.writeFile( path.join(this.tpath, this.html_fn), false, htm );
	}
	main();
}
//#############################################################################
async readCSS() {
	try {
		const fp_write = path.join(this.tpath, this.css_fn );
		await this.mkFolder( this.tpath );
		await this.writeNullFile( fp_write );
		//+++++++++++++
		const dir = await fs.promises.opendir( this.path_css, {withFileTypes: true} );
		
		for await (const dirent of dir){
			const ext = path.extname( dirent.name );
			if( dirent.isFile() && ext === ".css" ){
				const fp_read  = path.join(this.path_css, dirent.name );
				
				await this.copyFile( fp_read, fp_write, true );
			//	console.log( fp_read+" >>> "+fp_write );
				
			//	console.log(dirent.name);
			}
		}
		//+++++++++++++
		await this.copyFolder();
		await this.copyFolder("fonts", "fonts");
		await this.copyFolder("img", "img");
		await this.copyFolder("svg", "svg");
		//+++++++++++++
	} catch (err) {
		console.error(err);
	}
}
//#############################################################################
async copyFolder(from = "", to = "") {
	try {
		await this.mkFolder( path.join(this.tpath, this.ass_dir, to ) );
		//+++++++++++++
		const dir = await fs.promises.opendir( path.join(this.path_ass, from), {withFileTypes: true} );
		
		for await (const dirent of dir){
			//	console.log( " === "+dirent.name );
			if( dirent.isFile() ){
				const fp_read  = path.join(this.path_ass, from, dirent.name);
				const fp_write = path.join(this.tpath, this.ass_dir, to, dirent.name);

				await this.copyFile2( fp_read, fp_write );

			//	console.log( fp_read+" >>> "+fp_write );
			}
		}
		//+++++++++++++
	} catch (err) {
		console.error(err);
	}
}
//#############################################################################
copyFile2( fp_read, fp_write ) {
	fs.promises.copyFile(fp_read, fp_write);
}

copyFile( fp_read, fp_write, app = false ) {
	let dt = "";
	let readStream = fs.createReadStream( fp_read );
	readStream.setEncoding("UTF8");

	readStream.on("data", (chunk) => {
		dt += chunk;
	});
	
	readStream.on("end", () => {
	//	console.log( dt );
		if(dt != null){
			this.writeFile(fp_write, app, dt);
		}else{
			this.writeFile(fp_write, app );
		}
	//	console.log( dt );
	});
	
	readStream.on("error", (error) => {
		console.log( error.stack );
	});
}
//#############################################################################
readFile( fp ) {
	return new Promise((resolve, reject) => {
	let dt = "";
	let readStream = fs.createReadStream( fp );
	readStream.setEncoding("UTF8");

	readStream.on("data", (chunk) => {
		dt += chunk;
	});
	
	readStream.on("end", () => {
		this.data = dt;
	//	console.log( this.data );
		resolve( dt );
		return dt;
	});
	
	readStream.on("error", (error) => {
		console.log( error.stack );
		reject("");
	});

	});
}
//#############################################################################
writeFile( fp, app = false, dt = "" ) {
	//	let writeStream = fs.createWriteStream( fp, {flags:'a'} );
	//	let writeStream = fs.createWriteStream( fp );
		let writeStream = null;
	if(app){
		writeStream = fs.createWriteStream( fp, {flags:'a'} );
	}else{
		writeStream = fs.createWriteStream( fp );
	}

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
mkFolder( d_path = this.tpath ) {
	//	return new Promise((resolve, reject) => {
		//fs.access( d_path , error => {
			fs.mkdir( d_path, { recursive: true }, (err) => {
		//	if (!error) {
		//		fs.rmdir( d_path, { recursive: true, force: true }, (err) => {
		//			if(err) console.log( "Error:rem Folder: "+err );
		//			console.log( "====	====	remove Dir	====	====" );
		//		});		
		//	}
			});
			this.remFolder(d_path).then(()=>{	
				fs.mkdir( d_path, { recursive: true }, (err) => {
					if(err)	console.log( "Error:mk Folder: "+err );
				//	console.log( "====	====	Create Dir		====	====" );
				});
			});
	//		resolve("");
	//	});
	}
	remFolder( d_path = this.tpath ) {
		return new Promise( (resolve, reject) => {
			const dir = fs.readdir(d_path, (err, files) => {
			try{
				files.forEach( el => {
				fs.unlink( path.join(d_path, el), (err) => {
				//	if (err) console.log(err);
				//	else console.log("delete: "+el);
				});
			//	if(err) throw err;
			//	console.log('В папке находятся файлы:' + files);
				});
			}catch(ex){

			}
			});
			resolve("");
		});
	}
//#############################################################################
}
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
new HTMLBuilder("components", "styles", "assets", "project-dist");
