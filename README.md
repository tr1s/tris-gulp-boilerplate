## tris-gulp-boilerplate — Less think, more code 👩‍💻👨‍💻

#### This [gulp.js](https://gulpjs.com/) boilerplate takes all the hassle out of setting up a project and has all the necessary tools and optimizations ready to go.

##### It will fix common issues that arise via [Google Page Speed Insights](https://developers.google.com/speed/pagespeed/insights/) and will help your Google ranking on the web:

1. `Eliminating render-blocking JavaScript and CSS in above-the-fold content`
3. `Minifying HTML/CSS/JavaScript`
4. `Optimizing images`
5. `Prioritizing Visible above-the-fold content`
5. `Reduce server response time`

_`Enabling Compression` and `Leveraging Browser Caching` are achieved through methods unrelated to this boilerplate._

### Quick start

In the terminal where you want to start your project:

1. `git clone https://github.com/tr1s/tris-gulp-boilerplate.git`
2. `npm install`
3. `gulp`

You're all set. Starting building your website.

Take a look at the `gulpfile.js`, or read below for a better understanding of what's going on under the hood. You won't hit 100/100 on Google Page Insights right away, you'll have to look into enabling compression and leveraging browser caching on your own. Methods of implementing those features may be different depending on your hosting provider.

Follow me on [twitter](https://twitter.com/triscodes) if you'd like.

### Features:

1. `Browser-Sync`
2. `Live Reloading`
3. `HTML/CSS/JavaScript minification`
4. `ES6 to ES5 conversion`
5. `JavaScript concatenation`
6. `Image optimization`
7. `Webfont loading`

### Features Explained:

##### 1. Browser-Sync / Live Reloading

```javascript
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
});
```

```javascript
gulp.task('watch', ['browser-sync'], () => {
    gulp.watch('*.html', reload)
    gulp.watch('dev/styles/**/*.scss', ['sass'])
    gulp.watch('dev/scripts/**/*.js', ['scripts'])
});
```

The _watch_ task watches for changes on all the .html, .scss, and .js files, while also recompiling the .scss and .js before it triggers the live reload. **The _html_ doesn't need to recompile, hence why it only has _reload_ beside it. The _scss_ and _scripts_ task have the _reload_ piped at the end of each respective task like so -** `.pipe(reload({ stream: true }))`

##### 2. Minification