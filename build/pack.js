const path = require('path');
const fs = require('fs');
const projectPath = process.cwd();
const kPackPath = __dirname;
const spawn = require('child_process').spawn;
const argv = process.argv.slice(2);

var commandArr = ['build'];
if(argv){
    commandArr = commandArr.concat(argv);
}

function gulp(args,options, fn){
    let _args = [path.resolve(kPackPath, '..' ,'node_modules/gulp/bin/gulp.js')].concat(args);//args 不能写空
    execute('node', _args, options, fn);
}

function execute(cmd, args, options, fn) {
    let proc = spawn(cmd, args, options);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on('close', function (code) {
        fn(code === 0, code);
    });
}

function buildProject(projectDir){
    gulp(commandArr,{
        cwd: path.join(projectDir,'build'),
        env: process.env
    }, function(success, code){
        console[success ? 'log' : 'error']('Gulp exit[%s]', code);
    });
}

buildProject(projectPath);