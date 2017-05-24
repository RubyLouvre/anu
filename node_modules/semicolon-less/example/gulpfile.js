'use strict'

var gulp = require('gulp')
var less = require('../gulpplugin')

gulp.task('default', function () {
	return gulp.src(';-itis/*.js').pipe(less()).pipe(gulp.dest(';-less'))
})
