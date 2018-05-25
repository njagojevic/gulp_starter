// Load gulp and plugins
var gulp =          require('gulp'),
    config =        require('./gulp.config')(),
    scsslint =      require('gulp-scss-lint'),
    print =         require('gulp-print').default,
    del =           require('del'),
    runSequence =   require('run-sequence'),
    args =          require('yargs').argv,
    $ =             require('gulp-load-plugins')({lazy: true});

/*
 *  SASS task
 *  ------------------------------
 *  Compile SASS to CSS
 *  Add vendor prefixes
 *  Create minified version of CSS
 *  Generate sourcemaps
 *  ------------------------------
 */
gulp.task('sass', ['scss-lint'], function() {
    log('Compiling SASS --> CSS');
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
 *  SCSS lint task
 *  -----------------
 *  Linting Sass code
 *  -----------------
 */
gulp.task('scss-lint', function () {
    log('Linting SASS code');
    return gulp.src(config.sass)
        .pipe(scsslint());
});

/*
 *  Scripts task
 *  --------------------
 *  Concatenate js files
 *  Minify js
 *  Generate sourcemaps
 *  --------------------
 */
gulp.task('scripts', ['js-hint'], function() {
    log('Concat & Minify JS');
    return gulp.src(config.js)
        .pipe($.sourcemaps.init())
        .pipe($.concat('main.js'))
        .pipe(gulp.dest(config.temp))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.uglifyes())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.build_js));
});

/*
 * JS Hint task
 * ------------------------------------
 * Analyze JS code with JSHint and JSCS
 * ------------------------------------
 */
gulp.task('js-hint', function() {
    log('Analyzing source with JSHint and JSCS');
    return gulp
        .src(config.js)
        .pipe($.if(args.verbose, print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

/*
 *  Clean task
 *  ----------------------
 *  Remove temporary files
 *  ----------------------
 */
gulp.task('clean', function() {
    clean(config.temp);
});

/*
 *  Watch task
 *  ------------------
 *  Watch SASS changes
 *  Watch JS changes
 *  ------------------
 */
gulp.task('watch', function() {
    gulp.watch(config.sass, function(){
        runSequence(
            'sass',
            'clean'
        );
    });
    gulp.watch(config.js, function(){
        runSequence(
            'scripts',
            'clean'
        );
    });
});

/*
 *  Default task
 *  -------------
 */
gulp.task('default', function(){
    runSequence(
        'sass',
        'scripts',
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
