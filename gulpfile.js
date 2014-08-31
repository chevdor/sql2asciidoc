var gulp = require('gulp');
var clean = require('gulp-rimraf');
var bump = require('gulp-bump');
var pandoc = require('gulp-pandoc');
var print = require('gulp-print');
// var run = require('gulp-run');
var shell = require('gulp-shell');
var ccl = require('conventional-changelog');
var pjson = require('./package.json');

gulp.task('clean', function(cb) {
    return gulp.src(['doc/*', './readme.md'], {
            read: false
        })
        .pipe(print())
        .pipe(clean({
            force: true
        }));
});

gulp.task('changelog', function() {
    // run('asciidoc -b docbook -o ./doc/readme.xml readme.adoc').exec();

    ccl({
        repository: 'https://github.com/chevdor/sql2asciidoc',
        version: pjson.version
    }, function(err, log) {
        console.log('changelog is here:\n', log);
    });
})

gulp.task('adoc2docbook', function() {
    // run('asciidoc -b docbook -o ./doc/readme.xml readme.adoc').exec();

    return gulp.src('readme.adoc', {
            read: false
        })
        .pipe(shell(['asciidoc -a data-uri -b docbook -o ./doc/readme.xml <%= file.path %>']))
        .pipe(gulp.dest('doc/'))
})

gulp.task('bump', function() {
    gulp.task('bump', function() {
        gulp.src('./package.json')
            .pipe(bump())
            .pipe(gulp.dest('./'));
    });
})

gulp.task('docbook2md', ['adoc2docbook'], function() {
    return gulp.src('./doc/readme.xml', {
            //cwd: './doc/'
        })
        //.pipe(print())
        .pipe(pandoc({
            from: 'docbook',
            to: 'markdown',
            ext: '.md',
            args: ['--smart']
        }))
        .pipe(gulp.dest('./doc'))
        .pipe(gulp.dest('./'));
})

gulp.task('doc', ['clean', 'docbook2md'], function() {

})

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});
