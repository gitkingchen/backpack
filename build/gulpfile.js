const 
    path = require('path'),
    gulp = require('gulp'),
    uglify = require('gulp-uglify');//js
    cssmin = require('gulp-clean-css');//css
 	clean = require('gulp-clean');//clean
 	RevAll = require('gulp-rev-all');//md5
 	jsonminify = require('gulp-jsonminify');//json
 	gulpSequence = require('gulp-sequence');//队列
    htmlmin = require('gulp-htmlmin');//html
    revdel = require('gulp-rev-delete-original');//del original
    imagemin = require('gulp-imagemin');//img
    base64 = require('gulp-base64');

const projectPath = __dirname;

const inputDir = path.resolve(projectPath,'..','src');//源目录
const publishDir = path.resolve(projectPath,'..', 'dist');//输出目录

const htmlPaths = path.resolve(projectPath,'..', 'src/**/*.html');
const imgPaths = path.resolve(projectPath, '..','src/**/*.@(png|jpg|jpeg|gif|svg)');
const jsonPaths = path.resolve(projectPath,'..', 'src/**/*.json');
const jsPaths = path.resolve(projectPath,'..', 'src/**/*.js');
const cssPaths = path.resolve(projectPath,'..', 'src/**/*.css');
const otherPaths = path.resolve(projectPath,'..', 'src/**/*.!(png|jpg|jpeg|gif|svg|css|js|html|json)');

gulp.task('htmlmin', function(){

    var options = {
        removeComments: true,//删除注释
        collapseBooleanAttributes: true,//合并属性
        removeAttributeQuotes: true,//删除引号
        removeRedundantAttributes: true,//删除默认
        useShortDoctype: true,//用html5 声明
        removeScriptTypeAttributes: true,//删除 text/javascript
        removeStyleLinkTypeAttributes: true,//删除 text/css
        removeOptionalTags: true,//删除html body head 标签
        collapseWhitespace: true,//压缩HTML
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };

    return gulp.src(htmlPaths)
    .pipe(htmlmin(options))
    .pipe(gulp.dest(publishDir));

});

gulp.task('jsmin', function () {//压缩js
    return gulp.src(jsPaths)
    .pipe(uglify())
    .pipe(gulp.dest(publishDir));
});


gulp.task('build-js', function(cb){
    return gulpSequence('htmlmin', 'jsmin', cb);
});
 
gulp.task('imgcompress', function () {
    return gulp.src(imgPaths)
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(publishDir));
});

gulp.task('img', function () {
    return gulp.src(imgPaths)
        .pipe(gulp.dest(publishDir));
});
 
gulp.task('jsonmin', function () {
    return gulp.src(jsonPaths)	
        .pipe(jsonminify())
        .pipe(gulp.dest(publishDir));
});


gulp.task('clean', function () {//清除dist 要加return
    return gulp.src(publishDir,{read: false})
        .pipe(clean(
            {
                force: true
            }
        ));
});

gulp.task('cssmin', function () {
    return gulp.src(cssPaths)
        .pipe(base64({
                extensions: ['png', 'jpg'],
                maxImageSize: 20*1024,
                debug: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(publishDir));
});

gulp.task('revall', function () {
    return gulp.src(publishDir + '/**/*')
        .pipe(RevAll.revision({
            dontRenameFile: [ '.html', '.json' ],    //打包除了html和json 其他都改名
            dontUpdateReference: [ '.html', '.json' ] //引用用原始的 其他格式的引用带md5
        }))
        .pipe(revdel())
        .pipe(gulp.dest(publishDir))
});


gulp.task('otherFiles', function () {
    return gulp.src(otherPaths)
    .pipe(gulp.dest(publishDir));
});

function taskBuild(cb){
    gulpSequence('clean', ['cssmin','img','jsonmin','build-js','otherFiles'], cb);
}

gulp.task('default',taskBuild);
gulp.task('build',taskBuild);
gulp.task('imgmin', function(cb){
    gulpSequence('clean',  ['cssmin','imgcompress','jsonmin','build-js','otherFiles'], cb);
});

/*
注意事项：
return 最好每个都加return 否则后面的任务会执行不上
*/


