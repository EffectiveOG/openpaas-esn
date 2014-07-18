'use strict';

angular.module('esnApp', [
  'restangular',
  'ngRoute',
  'mgcrea.ngStrap.affix',
  'ui.notify',
  'FBAngular',
  'angularMoment',
  'esn.core',
  'esn.member',
  'esn.domain',
  'esn.avatar',
  'esn.profile',
  'esn.user',
  'esn.message',
  'esn.session',
  'esn.activitystream',
  'esn.websocket',
  'esn.easyrtc',
  'esn.conference',
  'esn.contact',
  'esn.community',
  'esn.application',
  'esn.authentication'
]).config(function($routeProvider, RestangularProvider) {

    $routeProvider.when('/', {
      templateUrl: '/views/esn/partials/home'
    });

    $routeProvider.when('/domains/:id/members/invite', {
      templateUrl: '/views/esn/partials/domains/invite',
      controller: 'inviteMembers',
      resolve: {
        domain: function(domainAPI, $route, $location) {
          return domainAPI.get($route.current.params.id).then(
            function(response) {
              return response.data;
            },
            function(err) {
              $location.path('/');
            }
          );
        }
      }
    });

    $routeProvider.when('/messages/:id', {
      templateUrl: '/views/esn/partials/message',
      controller: 'whatsupMessageDisplayController',
      resolve: {
        message: function(messageAPI, $route, $location) {
          return messageAPI.get($route.current.params.id).then(
            function(response) {
              return response.data;
            },
            function(err) {
              $location.path('/');
            }
          );
        }
      }
    });

    $routeProvider.when('/profile', {
      templateUrl: '/views/esn/partials/profile',
      controller: 'profilecontroller'
    });

    $routeProvider.when('/contacts', {
      templateUrl: '/views/esn/partials/contacts',
      controller: 'contactsController',
      resolve: {
        addressbookOwner: function($q, session) {
          var d = $q.defer();
          session.ready.then(function(session) {
            d.resolve(session.user._id);
          });
          return d.promise;
        }
      }
    });

    $routeProvider.when('/domains/:domain_id/members', {
      templateUrl: '/views/esn/partials/members',
      controller: 'memberscontroller'
    });

    $routeProvider.when('/profile/avatar', {
      templateUrl: '/views/esn/partials/avatar',
      controller: 'avatarEdit'
    });

    $routeProvider.when('/conferences', {
      templateUrl: '/views/esn/partials/conference',
      controller: 'conferencesController',
      resolve: {
        conferences: function(conferenceAPI, $location) {
          return conferenceAPI.list().then(
            function(response) {
              return response.data;
            },
            function(err) {
              $location.path('/');
            }
          );
        }
      }
    });

    $routeProvider.when('/conferences/:conference_id', {
      templateUrl: '/views/modules/conference/live',
      controller: 'liveConferenceController',
      resolve: {
        conference: function(conferenceAPI, $route, $location) {
          return conferenceAPI.get($route.current.params.conference_id).then(
            function(response) {
              return response.data;
            },
            function(err) {
              $location.path('/');
            }
          );
        }
      }
    });

    $routeProvider.when('/applications', {
      templateUrl: '/views/modules/application/applications',
      controller: 'applicationController',
      resolve: {
        applications: function(applicationAPI, $location) {
          return applicationAPI.list().then(
            function(response) {
              return response.data;
            },
            function(err) {
              $location.path('/');
            }
          );
        }
      }
    });

    $routeProvider.when('/applications/:application_id', {
      templateUrl: '/views/modules/application/application-details',
      controller: 'applicationDetailsController',
      resolve: {
        application: function(applicationAPI, $route, $location) {
          return applicationAPI.get($route.current.params.application_id).then(
            function(response) {
              return response.data;
            },
            function(err) {
              $location.path('/applications');
            }
          );
        }
      }
    });

    $routeProvider.when('/communities', {
      templateUrl: '/views/esn/partials/communities',
      controller: 'communitiesController'
    });

    $routeProvider.when('/communities/create', {
      templateUrl: '/views/modules/community/community-create',
      controller: 'communityCreateController'
    });

    $routeProvider.when('/communities/:community_id', {
      templateUrl: '/views/modules/community/community',
      resolve: {
        community: function(communityAPI, $route, $location) {
          return communityAPI.get($route.current.params.community_id).then(
            function(response) {
              return response.data;
            },
            function(err) {
              $location.path('/communities');
            }
          );
        }
      }
    });

    $routeProvider.otherwise({redirectTo: '/'});

    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setFullResponse(true);
  });
