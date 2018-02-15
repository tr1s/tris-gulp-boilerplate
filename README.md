# tris-gulp-boilerplate — less think, more code 👩‍💻👨‍💻

#### This [gulp.js](https://gulpjs.com/) boilerplate takes all the hassle out of setting up a project — it has all the necessary tools and optimizations ready to go for your website. It will help you rank higher on Google by solving issues that arise when testing your site on [Google Page Speed Insights](https://developers.google.com/speed/pagespeed/insights/), those issues being:

* `Eliminating render-blocking JavaScript and CSS in above-the-fold content`
* `Minifying HTML/CSS/JavaScript`
* `Optimizing images`
* `Prioritizing Visible above-the-fold content`
* `Reducing server response time`

_**`Enabling Compression`** and **`Leveraging Browser Caching`** are achieved through methods unrelated to this boilerplate. Read [this](https://developers.google.com/speed/docs/insights/EnableCompression) and [this](https://developers.google.com/speed/docs/insights/LeverageBrowserCaching) for more info. You won't achieve a 100/100 optimization score until you implement these, but you'll at least be up to 90 without them!_

### Quick start:

You need [git](https://git-scm.com/) and [node.js](https://nodejs.org/) on your computer before running

1. `git clone https://github.com/tr1s/tris-gulp-boilerplate.git`
2. `npm install`
3. `gulp`

You're all set, start coding!

**_Take a look at the `gulpfile.js` and/or read below for a better understanding of what's going on under the hood._**

### Features:

1. `Browser-Sync` + `Live reloading`
2. `HTML/CSS/JavaScript minification`
3. `CSS autoprefixing`
4. `JavaScript ES6 to ES5 conversion` + `concatenation`
5. `Image optimization`
6. `Prioritize Above the fold content`
7. `Webfont loading`

### Gulp tasks explained:

Keep an eye on the ordering of the `.pipe` to have a clear idea of what's going on in these tasks that are in the _gulpfile.js_

___

```javascript
const gulp = require('gulp');
```

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

The _watch_ task watches for changes on all the .html, .scss, and .js files, while also recompiling the .scss and .js before it triggers the live reload. **The _html_ doesn't need to recompile, hence why it only has _reload_ beside it. The _sass_ and _scripts_ task have the _reload_ piped at the end of each respective task like so -** `.pipe(reload({ stream: true }))`

#### HTML

```javascript
const htmlmin = require('gulp-htmlmin');
```

```javascript
gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public/'))
});
```

The html task grabs the source _index.html_ from the root folder, [minifies](https://www.npmjs.com/package/gulp-htmlmin) it, then outputs minified _index.html_ in the public/ folder.

#### Sass

```javascript
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
```

```javascript
gulp.task('sass', () => {
    return gulp.src('dev/styles/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/styles/'))
        .pipe(reload({ stream: true }))
});
```

The [sass](https://www.npmjs.com/package/gulp-sass) task  grabs the source .scss file and converts it all to css, then [autoprefixes](https://www.npmjs.com/package/gulp-autoprefixer) the css, then [minifies](https://www.npmjs.com/package/gulp-clean-css) the css, then outputs a _styles.css_ file inside the public/styles/ folder for you to link from the _index.html_. After all that it reloads the page on save.

#### Scripts

```javascript
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const minify = require('gulp-babel-minify');
```

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

The scripts task grabs the source JavaScript files _(order matters depending on what scripts are dependent on what)_ and [concatenates](https://www.npmjs.com/package/gulp-concat) them to _all.js_ — this reduces server response time because the browser will only need to grab one .js file instead of many. The task then uses [babel](https://www.npmjs.com/package/gulp-babel) to convert _all.js_ from ES6 to ES5, then [minifies](https://www.npmjs.com/package/gulp-babel-minify), then outputs to public/scripts/ while finally reloading the page on save.

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

```javascript
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
```

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

___

Hope this helped! Follow me on [twitter](https://twitter.com/triscodes) if you'd like. 💎✨🌸