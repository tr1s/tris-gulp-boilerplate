const gulp = require('gulp');
const critical = require('critical');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const babel = require('gulp-babel');
const minify = require('gulp-babel-minify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const cache = require('gulp-cache');
const concat = require('gulp-concat');

// WATCHING FOR FILE CHANGES
gulp.task('watch', ['browser-sync'], () => {
    gulp.watch('dev/styles/**/*.scss', ['sass'])
    gulp.watch('*.html', reload)
    gulp.watch('dev/scripts/**/*.js', ['scripts'])
});

// BROWSER-SYNC / LIVE RELOADING
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
});

// HTML MINIFICATION
gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public/'))
});

// HTML VIEWPORT INLINE STYLES WITH CRTITCAL
gulp.task('critical', function () {
    critical.generate({
        inline: true,
        base: 'public/',
        src: 'index.html',
        width: 700,
        height: 400,
        css: 'public/styles/styles.css',
        dest: 'index-critical.html',
        minify: true,
        extract: true,
        ignore: ['@font-face']
    });
});

// SASS INTO CSS THEN AUTOPREFIXING THEN MINIFY
gulp.task('sass', () => {
    return gulp.src('dev/styles/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/styles/'))
        .pipe(reload({ stream: true }))
});

// IMAGE OPTIMIZATION
gulp.task('images', () =>
    gulp.src('dev/images/*')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('public/images/'))
);

// ES6 TO ES5
gulp.task('scripts', () => {
    gulp.src(['dev/scripts/smooth-scroll.js', 'dev/scripts/vanilla-tilt.babel.min.js', 'dev/scripts/script.js'])
        .pipe(concat('all.js'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(gulp.dest('public/scripts/'))
        .pipe(reload({ stream: true }))
});

// ALL TASKS INTO ONE INIT
gulp.task('default', ['browser-sync', 'html', 'sass', 'scripts', 'critical', 'images', 'watch']);