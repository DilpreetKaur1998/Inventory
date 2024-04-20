var exec = require('child_process').exec;
var gulpfile = require('gulp');
var gzip = require('gulp-gzip');

var rimraf = require('rimraf');


gulpfile.task('build-clean',function(done){
  rimraf.sync('./dist');
  console.log('dist deleted done');
  rimraf.sync('../src/main/resources/static/*');
  console.log('spring boot static deleted !');
  done();
});


gulpfile.task('cleanup',function(done){
  rimraf.sync('./dist');
  console.log('dist deleted done');
  rimraf.sync('../bin/*');
  console.log('inventory-api bin deleted !');
  done();
});


gulpfile.task('build-run',gulpfile.series(gulpfile.parallel('build-clean'), function (done) {
  console.log('build-run !');
  buildCommand ='npm run build --prod';
  exec(buildCommand, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if(err){
      done(err);
    }else{
      done();
    }
  });
  console.log('executing :' +buildCommand);
}));

gulpfile.task('build-copy',gulpfile.series(gulpfile.parallel('build-run'), function (done) {
  gulpfile.src('./dist/ui/*/')
    .pipe(gulpfile.dest('../src/main/resources/static'));
  done();
  console.log('copy build to dist');
}));


gulpfile.task('default',gulpfile.series(gulpfile.parallel('build-copy'), function (done) {
  console.log('deploy completed');
  done();
}));
