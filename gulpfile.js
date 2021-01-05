var gulp = require('gulp');
var connect = require('gulp-connect');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();
var del = require('del');
var addsrc = require('gulp-add-src');
var jsReporter = require('jshint-stylish');
var annotateAdfPlugin = require('ng-annotate-adf-plugin');
var pkg = require('./package.json');

var annotateOptions = {
  plugin: [
    annotateAdfPlugin
  ]
};

var redmineTemplate = {
  root: '{widgetsPath}/redmine/src/main',
  module: 'adf.widget.redmine'
};
var easyRedmineTemplate = {
  root: '{widgetsPath}/redmine/src/main',
  module: 'adf.widget.easyredmine'
};

/** lint **/

gulp.task('csslint', function(){
  gulp.src('src/**/*.css')
      .pipe($.csslint())
      .pipe($.csslint.reporter());
});

gulp.task('jslint', function(){
  gulp.src('src/**/*.js')
      .pipe($.jshint())
      .pipe($.jshint.reporter(jsReporter));
});

gulp.task('lint', ['csslint', 'jslint']);

/** serve **/

gulp.task('redmineTemplate', function(){
  return gulp.src('src/main/**/*.html')
    .pipe($.angularTemplatecache('redmineTemplates.tpl.js', redmineTemplate))
    .pipe(gulp.dest('.tmp/dist'));
});

gulp.task('easyRedmineTemplate', function(){
  return gulp.src('src/main/**/*.html')
    .pipe($.angularTemplatecache('easyRedmineTemplates.tpl.js', easyRedmineTemplate))
    .pipe(gulp.dest('.tmp/dist'));
});

gulp.task('sample', ['redmineTemplate', 'easyRedmineTemplate'], function(){
  var files = gulp.src(['src/main/**/*.js', 'src/main/**/*.css', 'src/main/**/*.less', '.tmp/dist/*.js']);

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
});

gulp.task('watch', function(){
  gulp.watch(['src/main/**'], ['sample']);
});

gulp.task('serve', ['watch', 'sample'], function(){
  connect.server({
    root: ['.tmp/dist', '.'],
    livereload: true,
    port: 9002
  });
});

/** build **/

gulp.task('css', function(){
  gulp.src(['src/main/**/*.css', 'src/main/**/*.less'])
      .pipe($.if('*.less', $.less()))
      .pipe($.concat(pkg.name + '.css'))
      .pipe(gulp.dest('dist'))
      .pipe($.rename(pkg.name + '.min.css'))
      .pipe($.minifyCss())
      .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
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
});

/** clean **/

gulp.task('clean', function(cb){
  del(['dist', '.tmp'], cb);
});

gulp.task('default', ['css', 'js']);
