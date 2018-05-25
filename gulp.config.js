// Gulp configuration
module.exports = function() {
    var config = {
        /* File paths */
        /* ----------------------------- */
        // Temporary files
        temp: 'tmp/',

        // Sass files
        sass: 'assets/sass/**/*.scss',

        // CSS build
        css: 'dist/css/',

        // JS files
        js: 'assets/js/**/*.js',

        // JS build
        build_js: 'dist/js/',

        // Images
        images: 'assets/images/**/*.{gif,png,jpg,svg}',

        // Images build
        build_images: 'dist/images/',
        /* ----------------------------- */

        /* Supported browsers */
        browsers: [
            'last 2 version',
            '> 2%'
        ],
        /* ----------------------------- */

        /* BrowserSync proxy */
        proxy: 'gulp-starter.local'
    };

    return config;
};
