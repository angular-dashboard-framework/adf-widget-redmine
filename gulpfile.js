'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const wiredep = require('wiredep').stream;
const $ = require('gulp-load-plugins')();
const del = require('del');
const addsrc = require('gulp-add-src');
const jsReporter = require('jshint-stylish');
const annotateAdfPlugin = require('ng-annotate-adf-plugin');
const pkg = require('./package.json');

const annotateOptions = {
  plugin: [
    annotateAdfPlugin
  ]
};

const redmineTemplate = {
  root: '{widgetsPath}/redmine/src/main',
  module: 'adf.widget.redmine'
};
const easyRedmineTemplate = {
  root: '{widgetsPath}/redmine/src/main',
  module: 'adf.widget.easyredmine'
};

/** lint **/
gulp.task('csslint', (done) => {
  gulp.src('src/**/*.css')
    .pipe($.csslint())
    .pipe($.csslint.reporter());
  done();
});

gulp.task('jslint', (done) => {
  gulp.src('src/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(jsReporter));
  done();
});

gulp.task('lint', gulp.series('csslint', 'jslint'));

gulp.task('redmineTemplate', (done) => {
  gulp.src('src/main/**/*.html')
    .pipe($.angularTemplatecache('redmineTemplates.tpl.js', redmineTemplate))
    .pipe(gulp.dest('.tmp/dist'));
  done();
});

gulp.task('easyRedmineTemplate', (done) => {
  gulp.src('src/main/**/*.html')
    .pipe($.angularTemplatecache('easyRedmineTemplates.tpl.js', easyRedmineTemplate))
    .pipe(gulp.dest('.tmp/dist'));
  done();
});

gulp.task('sample', gulp.series('redmineTemplate', 'easyRedmineTemplate', function (done) {
  const files = gulp.src(['src/main/**/*.js', 'src/main/**/*.css', 'src/main/**/*.less', '.tmp/dist/*.js']);

  gulp.src('sample/index.html')
    .pipe(wiredep({
      directory: './components/',
      bowerJson: require('./bower.json'),
      devDependencies: true,
      dependencies: true
    }))
    .pipe($.inject(files))
    .pipe(gulp.dest('.tmp/dist'))
    .pipe(connect.reload());
  done();
}));

gulp.task('watch', (done) => {
  gulp.watch(['src/main/**'], gulp.series('sample', (done) => {
    done();
  }));
  done();
});


/** build **/
gulp.task('css', (done) => {
  gulp.src(['src/main/**/*.css', 'src/main/**/*.less'])
    .pipe($.if('*.less', $.less()))
    .pipe($.concat(pkg.name + '.css'))
    .pipe(gulp.dest('dist'))
    .pipe($.rename(pkg.name + '.min.css'))
    .pipe($.minifyCss())
    .pipe(gulp.dest('dist'));
  done();
});


gulp.task('js', (done) => {
  gulp.src(['src/main/**/*.js', 'src/main/**/*.html'])
    .pipe($.if('*.html', $.minifyHtml()))
    .pipe($.if('*.html', $.angularTemplatecache(pkg.name + '.js', redmineTemplate)))
    .pipe(addsrc('src/main/**/*.html')) //Add again for easyredmine as angularTemplatecache purges all html files from the pipe
    .pipe($.if('*.html', $.minifyHtml()))
    .pipe($.if('*.html', $.angularTemplatecache('adf-widget-redmine.js', easyRedmineTemplate)))
    .pipe($.angularFilesort())
    .pipe($.if('*.js', $.replace(/'use strict';/g, '')))
    .pipe($.concat(pkg.name + '.js'))
    .pipe($.headerfooter('(function(window, undefined) {\'use strict\';\n', '})(window);'))
    .pipe($.ngAnnotate(annotateOptions))
    .pipe(gulp.dest('dist'))
    .pipe($.rename(pkg.name + '.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('dist'));

  done();
});

/** clean **/
gulp.task('clean', function (cb) {
  del(['dist', '.tmp'], cb);
});

gulp.task('default', gulp.series('css', 'js')); // fills dist folder for release

/** serve **/
gulp.task('serve', gulp.series('watch', function () {
  connect.server({
    root: ['.tmp/dist', '.'],
    livereload: true,
    port: 9002
  });
}));
