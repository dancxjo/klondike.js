module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'lib/angular/angular.js',
      'lib/angular-route/angular-route.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/draganddrop.js',
      'lib/jquery/dist/jquery.min.js',
      '*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome', 'Firefox'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
