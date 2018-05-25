// Gulp configuration
module.exports = function() {
    var config = {
        // Temporary files
        temp: 'tmp/',

        // Sass files paths
        sass: 'assets/sass/**/*.scss',

        // CSS path
        css: 'dist/css/',

        // Supported browsers
        browsers: [
            'last 2 version',
            '> 5%'
        ]
    };

    return config;
};
