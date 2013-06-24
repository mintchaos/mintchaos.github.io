module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      'static/labs.js': ['static/js/**/*.js'],
      // options: {
      //   externalize: ['static/js/**/*.js']
      // }
    },
    watch: {
    scripts: {
      files: ['static/js/**/*.js'],
      tasks: ['browserify'],
      options: {
        nospawn: true,
      },
    },
  },
  });

  grunt.registerTask('default', ['browserify'])

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-browserify')
}