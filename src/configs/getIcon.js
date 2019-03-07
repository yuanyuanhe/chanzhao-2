/**
 * 获取文件夹中icon并导出为scss文件
*/
var fs = require('fs');
var path = require('path');

// usage node test.js p=/home/xox/ui/切图 > [absolute path & filename to save]
let params = {}
process.argv.forEach(v => {
    let arr = v.split('=');
    params[arr[0]] = arr[1];
});

//解析需要遍历的文件夹
let filePath = params["p"] || path.resolve("");
//调用文件遍历方法
fileDisplay(filePath).then( fileNames => {
    fileNames.forEach( filename => {
        if ( filename[0] == '.' ) {
            return
        }
        console.log(`$${filename.replace(/\s/g, "").replace(/-/g, "_").replace(/\..*/, "").toUpperCase()}: "${filename}";`);
    } );
    console.log( ":export {" );
    fileNames.forEach( filename => {
        if ( filename[0] == '.' ) {
            return
        }
        let up = filename.replace(/\s/g, "").replace(/-/g, "_").replace(/\..*/, "").toUpperCase();
        console.log(`  ${up}: $${up};`)
    } )
    console.log( "}" )
} )

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表
    return new Promise(resolve => {
        // let fileNames = [];
        fs.readdir(filePath, function (err, files) {
            resolve( files );
        });
    })

}
