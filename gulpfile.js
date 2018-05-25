// Load gulp and plugins
var gulp =          require('gulp'),
    config =        require('./gulp.config')(),
    print =         require('gulp-print').default,
    del =           require('del'),
    runSequence =   require('run-sequence').use(gulp),
    args =          require('yargs').argv,
    browserSync =   require('browser-sync').create(),
    $ =             require('gulp-load-plugins')({lazy: true});

/*
 *  -------------------------------------------
 *  SASS task
 *  -------------------------------------------
 *  - Compile SASS to CSS
 *  - Add vendor prefixes
 *  - Create minified version of CSS
 *  - Generate sourcemaps
 *  - Reload browser if browserSync initialized
 *  -------------------------------------------
 */
gulp.task('sass', ['scss-lint'], function() {
    log('>>> Compiling SASS --> CSS <<<');
    return gulp.src(config.sass)
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.autoprefixer({ browsers: config.browsers }))
        .pipe(gulp.dest(config.temp))
        .pipe($.cssmin())
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.css))
        .pipe(browserSync.reload({stream: true}));
});

/*
 *  -------------------
 *  SCSS lint task
 *  -------------------
 *  - Linting Sass code
 *  -------------------
 */
gulp.task('scss-lint', function () {
    log('>>> Linting SASS code <<<');
    return gulp.src(config.sass)
        .pipe($.scssLint());
});

/*
 *  -------------------------------------------
 *  Scripts task
 *  -------------------------------------------
 *  - Concatenate js files
 *  - Minify js
 *  - Remove debug statements
 *  - Generate sourcemaps
 *  - Reload browser if browserSync initialized
 *  -------------------------------------------
 */
gulp.task('scripts', ['js-hint'], function() {
    log('>>> Concat & Minify JS <<<');
    return gulp.src(config.js)
        .pipe($.sourcemaps.init())
        .pipe($.concat('main.js'))
        .pipe($.stripDebug())
        .pipe(gulp.dest(config.temp))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.uglifyes())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.build_js))
        .pipe(browserSync.reload({stream: true}));
});

/*
 *  --------------------------------------
 *  JS Hint task
 *  --------------------------------------
 *  - Analyze JS code with JSHint and JSCS
 *  --------------------------------------
 */
gulp.task('js-hint', function() {
    log('>>> Analyzing source with JSHint and JSCS <<<');
    return gulp.src(config.js)
        .pipe($.if(args.verbose, print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

/*
 *  -----------------------------------
 *  BrowserSync task
 *  -----------------------------------
 *  - Syncing code changes on file save
 *  -----------------------------------
 */
gulp.task('browsersync', function() {
    log('>>> Initialize browserSync <<<');
    browserSync.init({
        proxy: config.proxy
    });
});

/*
 *  --------------------------
 *  Images task
 *  --------------------------
 *  - Minify images into build
 *  --------------------------
 */
gulp.task('images', function() {
    log('>>> Optimizing images <<<');
    return gulp.src(config.images)
        .pipe($.cache($.imagemin([
            $.imagemin.gifsicle({interlaced: true}),
            $.imagemin.jpegtran({progressive: true}),
            $.imagemin.optipng({optimizationLevel: 5}),
            $.imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ])))
        .pipe(gulp.dest(config.build_images));
});

/*
 *  ------------------------
 *  Clean task
 *  ------------------------
 *  - Remove temporary files
 *  ------------------------
 */
gulp.task('clean', function() {
    clean(config.temp);
});

/*
 *  ----------------------------------------
 *  Watch task
 *  ----------------------------------------
 *  - Watch SASS changes
 *  - Watch JS changes
 *  ----------------------------------------
 */
gulp.task('watch', ['browsersync'], function() {
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
 *  ----------
 *  Build task
 *  ----------
 */
gulp.task('build', function(){
    log('>>> Building project <<<')
    runSequence(
        'sass',
        'scripts',
        'clean',
        'images'
    );
});

/*
 *  ------------
 *  Default task
 *  ------------
 */
gulp.task('default', ['browsersync'], function(){
    runSequence(
        'sass',
        'scripts',
        'clean'
    );
});

/*
 *  ------------------------
 *  Custom functions
 *  ------------------------
 *  - Show log messages
 *  - Delete files & folders
 *  ------------------------
 */
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
