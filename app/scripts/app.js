'use strict';

var app = angular.module('angularMeetupApp', ['ngResource']);

app.config(function($routeProvider) {
  $routeProvider
      .when('/', {
        templateUrl: 'views/band-list.html',
        controller: 'BandListCtrl'
      })
      .when('/band-edit/:bandId', {
        templateUrl: 'views/band-edit.html',
        controller: 'BandEditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
});
