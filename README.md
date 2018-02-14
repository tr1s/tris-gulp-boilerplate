# tris-gulp-boilerplate — less think, more code 👩‍💻👨‍💻

### This [gulp.js](https://gulpjs.com/) boilerplate takes all the hassle out of setting up a project and has all the necessary tools and optimizations ready to go for your website.

##### It will help you rank higher on the web by solving issues that arise with when running your site through [Google Page Speed Insights](https://developers.google.com/speed/pagespeed/insights/), those issues being:

1. `Eliminating render-blocking JavaScript and CSS in above-the-fold content`
3. `Minifying HTML/CSS/JavaScript`
4. `Optimizing images`
5. `Prioritizing Visible above-the-fold content`
5. `Reducing server response time`

_`Enabling Compression` and `Leveraging Browser Caching` are achieved through methods unrelated to this boilerplate._

### Quick start:

In the terminal, navigate to a location where you want to start your project, then:

1. `git clone https://github.com/tr1s/tris-gulp-boilerplate.git`
2. `npm install`
3. `gulp`

You're all set, start coding!

###### _Take a look at the `gulpfile.js` and read below for a better understanding of what's going on under the hood. You won't hit 100/100 on Google Page Insights right away, you'll have to look into enabling compression and leveraging browser caching on your own. Methods of implementing those features may be different depending on your hosting provider._

Follow me on [twitter](https://twitter.com/triscodes) if you'd like.

### Features:

1. `Browser-Sync` + `Live reloading`
2. `HTML/CSS/JavaScript minification` + `autoprefixing`
3. `JavaScript ES6 to ES5 conversion` + `concatenation`
4. `Image optimization`
5. `Prioritize Above the fold content`
6. `Webfont loading`

#### Browser-Sync + Live Reloading

```javascript
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
```

```javascript
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

#### 2. Minification + autoprefixing

```javascript
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-babel-minify');
const autoprefixer = require('gulp-autoprefixer');
```

`.pipe(htmlmin({ collapseWhitespace: true }))` triggers the minification on the html task.

`.pipe(autoprefixer('last 2 versions'))` triggers autoprexing before `.pipe(cleanCSS())` triggers minification on the sass task.

`.pipe(minify({ mangle: { keepClassName: true }}))` triggers minification on the scripts task.

#### 3. JavaScript ES6 to ES5 conversion + concatenation

`const babel = require('gulp-babel');`

```javascript
gulp.task('scripts', () => {
    gulp.src(['dev/scripts/smooth-scroll.js', 'dev/scripts/script.js'])
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
```

`.pipe(concat('all.js'))` concats all your js files into `all.js` and then `.pipe(babel({ presets: ['env'] }))` triggers ES6 to ES5 conversion on the scripts task. Make sure if you add more .js files, you add them to the `gulp.src([])`. Remember, order matters.

#### Image optimization

```javascript
const imagemin = require('gulp-imagemin');
```

```javascript
gulp.task('images', () =>
    gulp.src('dev/images/*')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('public/images/'))
);
```

Again, this is different from [compression](https://developers.google.com/speed/docs/insights/EnableCompression).

#### Webfont loading

`<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>`

```javascript
WebFont.load({
  google: {
    families: ['Hind:300,600,700']
  }
});
```

Load fonts through Google's Webfont loader as opposed to using link tags in the header which leads to render blocking CSS. Check out their [GitHub](https://github.com/typekit/webfontloader) for more info.

#### Prioritizing above-the-fold content

Use [critical](https://github.com/addyosmani/critical) to inject inline styles for above-the-fold content on your website.

```javascript
const critical = require('critical');
```

```javascript
gulp.task('critical', function () {
    critical.generate({
        inline: true,
        base: 'public/',
        src: 'index.html',
        width: 1300,
        height: 900,
        css: 'public/styles/styles.css',
        dest: 'index-critical.html',
        minify: true,
        extract: true
    });
});
```

The _index-critial.html_ will generate in the public folder, simply rename it to _index.html_ and upload it to your hosting server if you'd like to use this feature. Here's their [GitHub](https://github.com/addyosmani/critical) for further reading.