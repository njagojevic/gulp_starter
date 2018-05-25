// Load gulp and plugins
var gulp =          require('gulp'),
    config =        require('./gulp.config')(),
    del =           require('del'),
    runSequence =   require('run-sequence'),
    $ =             require('gulp-load-plugins')({lazy: true});

/*
 *  SASS task
 *  Compile SASS to CSS
 *  Add vendor prefixes
 *  Create minified version of CSS
 *  Generate sourcemaps
 */
gulp.task('sass', function() {
    log('Compiling Sass --> CSS');
    return gulp.src(config.sass)
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.autoprefixer({ browsers: config.browsers }))
        .pipe(gulp.dest(config.temp))
        .pipe($.cssmin())
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.css));
});

/*
 *  Clean task
 *  Remove temporary files
 */
gulp.task('clean', function() {
    clean(config.temp);
});

/*
 *  Watch task
 *  Watch SASS changes
 */
gulp.task('watch', function() {
    gulp.watch(config.sass, function(){
        runSequence(
            'sass',
            'clean'
        );
    });
});

/*
 *  Default task
 */
gulp.task('default', function(){
    runSequence(
        'sass',
        'clean'
    );
});

// Custom functions
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path);
}
