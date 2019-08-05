'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');

var vendorPath = './bower_components';

gulp.task('copyHtml', function() {
    // copy any html files in source/ to public/
    gulp.src('source/*.html').pipe(gulp.dest('public'));
});

gulp.task('sass', function () {
    var sassFiles = [
        'source/sass/includes/main.scss',
        'source/sass/pages/**/*.scss',
        'source/sass/*.scss'
    ];
    var sassVendorFiles = [
        vendorPath + '/form.validation/dist/css/formValidation.css'
    ];
    var files = sassVendorFiles.concat(sassFiles);
    return gulp.src(files)
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(concat('app.css'))
        .pipe(gulp.dest('public/assets/css/'));
});

gulp.task('compressJs', function() {
    var jsFiles = [
        'source/js/includes/main.js',
        'source/js/*.js',
        'source/js/pages/**/*.js'
    ];
    var jsVendorFiles = [
        vendorPath + '/jquery/dist/jquery.js',
        vendorPath + '/bootstrap-sass/assets/javascripts/bootstrap.js',
        vendorPath + '/form.validation/dist/js/formValidation.js',
        vendorPath + '/form.validation/dist/js/framework/bootstrap.js'
    ];
    var files = jsVendorFiles.concat(jsFiles);
    gulp.src(files)
        .pipe(concat('app.js'))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '.min.js']
        }))
        .pipe(gulp.dest('public/assets/js'))
});

gulp.task('sassAdmin', function () {
    var sassFiles = [
        'source/admin/sass/includes/main.scss',
        'source/admin/sass/pages/**/*.scss',
        'source/admin/sass/*.scss'
    ];
    var sassVendorFiles = [
        vendorPath + '/form.validation/dist/css/formValidation.css'
    ];
    var files = sassVendorFiles.concat(sassFiles);
    return gulp.src(files)
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(concat('app.admin.css'))
        .pipe(gulp.dest('public/assets/css/'));
});

gulp.task('compressJsAdmin', function() {
    var jsFiles = [
        'source/admin/js/includes/main.js',
        'source/admin/js/*.js',
        'source/admin/js/pages/**/*.js'
    ];
    var jsVendorFiles = [
        vendorPath + '/form.validation/dist/js/formValidation.js',
        vendorPath + '/form.validation/dist/js/framework/bootstrap.js'
    ];
    var files = jsVendorFiles.concat(jsFiles);
    gulp.src(files)
        .pipe(concat('app.admin.js'))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '.min.js']
        }))
        .pipe(gulp.dest('public/assets/js'))
});

gulp.task('watch', ['copyHtml', 'sass', 'compressJs', 'sassAdmin', 'compressJsAdmin']);