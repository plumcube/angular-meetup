var testHelper = angular.module('ControllerTestHelper', ['angularMeetupApp']);

testHelper.service('fakeResource', function(apiService, _$httpBackend_, mocks) {
  var h = _$httpBackend_;

  var createResource = function(settings) {
    var getSpy, createSpy;

    var addReturns = function(requestHandler, response) {
      requestHandler.respond(_.isFunction(response) ? response() : response);
    };

    var addWhenGet = function(resource, settings) {
      var requestHandler = h.whenGET(settings.url);

      if (!getSpy) {
        getSpy = spyOn(resource, settings.method).andCallThrough();
      }

      return {
        returnsDefault: function() {
          addReturns(requestHandler, settings.response)
        },
        returns: function(response) {
          addReturns(requestHandler, response)
        }
      }
    };

    var addWhenCreate = function(resource, settings) {
      var requestHandler = h.whenPOST(settings.url);

      if (!createSpy) {
        createSpy = spyOn(resource, settings.method).andCallThrough();
      }

      return {
        returns: function(data) {
          requestHandler.respond(data);
        }
      }
    };

    var addWhenUpdate = function(settings) {
      var requestHandler = h.whenPUT(settings.url);

      return {
        returns: function(data) {
          requestHandler.respond(data);
        }
      }
    };

    return {
      getSpy: function() {
        return getSpy;
      },
      getCreateSpy: function() {
        return createSpy;
      },
      whenGetById: _.partial(addWhenGet, settings.resource, settings.byId),
      whenGetList: _.partial(addWhenGet, settings.resource, settings.list),
      whenCreate: _.partial(addWhenCreate, settings.resource, settings.create),
      whenUpdate: _.partial(addWhenUpdate, settings.update)
    }
  };

  return {
    flush: h.flush,
    album: createResource({
      resource: apiService.album,
      list: {
        url: '/albums',
        response: mocks.band.getList,
        method: 'query'
      },
      create: {
        url: '/albums',
        method: 'save'
      }
    }),
    band: createResource({
      resource: apiService.band,
      byId: {
        url: new RegExp('/bands/[0-9]+'),
        response: mocks.band.getById,
        method: 'get'
      },
      list: {
        url: '/bands',
        response: mocks.band.getList,
        method: 'query'
      },
      create: {
        url: '/bands',
        method: 'save'
      },
      update: {
        url: new RegExp('/bands/[0-9]+'),
        method: 'update'
      }
    }),
    member: createResource({
      resource: apiService.member,
      byId: {
        url: new RegExp('/members/[0-9]+'),
        response: mocks.member.getById,
        method: 'get'
      },
      list: {
        url: '/members',
        response: mocks.member.getList,
        method: 'query'
      }
    })

  };
});
