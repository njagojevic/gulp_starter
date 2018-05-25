// Gulp configuration
module.exports = function() {
    var config = {
        /* File paths */
        /* ----------------------------- */
        // Temporary files
        temp: 'tmp/',

        // Sass files
        sass: 'assets/sass/**/*.scss',

        // JS files
        js: 'assets/js/**/*.js',

        // CSS build path
        css: 'dist/css/',

        // JS build path
        build_js: 'dist/js/',
        /* ----------------------------- */

        /* Supported browsers */
        browsers: [
            'last 2 version',
            '> 5%'
        ]
    };

    return config;
};
