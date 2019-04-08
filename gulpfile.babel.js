// Initialise Modules
const { src, dest, watch, series, parallel } = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const babel = require('gulp-babel');

// Cache-busting date variable
let cbString = new Date().getTime();

// File paths
const files = {
    scssPath: 'app/scss/**/*.scss',
    jsPath: 'app/js/**/*.js'
};

// Sass task: compiles the style.scss into style.css
function scssTask() {
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // Initialise sourcemaps
        .pipe(sass()) // Compile Scss to Css
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCss plugins
        .pipe(sourcemaps.write('.')) // Write sourcemaps file in the current directory
        .pipe(dest('dist')); // Put final Css in dist folder
}

// JS task
function jsTask() {
    return src([files.jsPath])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(dest('dist'));
}

// Cache-busting task
function cacheBustTask() {
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}

// Watch task
function watchTask() {
    watch([files.scssPath, files.jsPath], parallel(scssTask, jsTask));
}

// Default task
exports.default = series(
    parallel(scssTask, jsTask),
    watchTask
);