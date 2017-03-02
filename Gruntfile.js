/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    distFolder: 'dist',
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
    '* Contributor(s): <%= _.pluck(pkg.contributors, "name").join(", ") %>;\n' +
    ' Licensed <%= pkg.license %> */\n',
    // Task configuration.
    uglify: {
      options: {
        banner: '<%= banner %>',
      },
      app: {
        src: '<%= distFolder %>/vanilla-notify.js',
        dest: '<%= distFolder %>/vanilla-notify.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },
      all: ['*.js']
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          '<%= distFolder %>/vanilla-notify.css': 'vanilla-notify.scss'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['default'],
        options: {
          spawn: false
        }
      },
      scripts: {
        files: '*.js',
        tasks: ['jshint', 'uglify'],
        options: {
          spawn: false
        }
      },
      styles: {
        files: '*.scss',
        tasks: ['compass'],
        options: {
          spawn: false
        }
      }
    },
    browserify: {
      all: {
        src: 'vanilla-notify.js',
        dest: '<%= distFolder %>/vanilla-notify.js',
        options: {
          browserifyOptions: {
            standalone: 'vNotify'
          },
          banner: '<%= banner %>'
        },
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task.
  grunt.registerTask('default', ['jshint', 'sass', 'browserify', 'uglify']);

};
