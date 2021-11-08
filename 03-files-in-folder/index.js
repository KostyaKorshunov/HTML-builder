const fs = require('fs');
const path = require('path');

class ReadFolder {
	fpath = ""

//#############################################################################
constructor(fn){
	this.fpath = path.resolve( __dirname, fn );					//	"../text.txt"
	this.readFolder();
}
//#############################################################################
async readFolder() {
	try {
		const dir = await fs.promises.opendir( this.fpath, {withFileTypes: true} );
		for await (const dirent of dir){
			if( dirent.isFile() ){
			//	fs.Stats
				fs.stat(path.join(this.fpath, dirent.name), (err, stats) => {
					const ext = path.extname( dirent.name );
					const fn = path.basename( dirent.name, ext );
					const sz = stats.size / 1024 ;
					console.log( fn+"	 -	 "+ext.replace(".", "")+"	 -	 "+sz+" kb." );
				});
			//	console.log(dirent.name);
			//	console.log(dirent.dir);
			}
		}
	} catch (err) {
		console.error(err);
	}
}
//#############################################################################
}
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
new ReadFolder("secret-folder");