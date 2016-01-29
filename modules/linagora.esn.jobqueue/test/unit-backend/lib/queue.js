'use strict';

var chai = require('chai');
var expect = chai.expect;
var mockery = require('mockery');
var q = require('q');

describe('The queue lib module', function() {

  var deps, dependencies;
  var jobMock = {
    create: function() {
      return {
        save: function() {}
      };
    },
    process: function() {}
  };

  var workersMock = {
    add: function() {},
    get: function() {},
    list: function() {}
  };

  var kueMock = {
    Job: {
      get: function() {
        return q([]);
      }
    },
    createQueue: function() {
      return jobMock;
    }
  };

  beforeEach(function() {

    dependencies = {
      logger: {
        info: function() {},
        error: function() {},
        debug: function() {},
        warn: function() {}
      }
    };

    deps = function(name) {
      return dependencies[name];
    };

    mockery.registerMock('kue', kueMock);
    mockery.registerMock('./workers', function() {
      return workersMock;
    });
  });

  var getModule = function() {
    return require('../../../backend/lib/queue')(deps);
  };

  describe('The startJob function', function() {
    it('should create job with correct parameters ', function(done) {
      var jobName = 'jobName';
      var option = {
        account: 'Name'
      };
      workersMock.get = function() {
        return 1;
      };
      jobMock.create = function(name) {
        expect(name).to.equal(jobName);
        return {
          save: function() {
            done();
          }
        };
      };
      getModule().startJob(jobName, option);
    });

    it('should reject if create job error ', function(done) {
      var jobName = 'jobName';
      jobMock.create = function() {
        return {
          save: function(callback) {
            return callback(1);
          }
        };
      };
      getModule().startJob(jobName).then(null, function() {
        done();
      });
    });

    it('should get worker if succeed creating job', function(done) {
      jobMock = {
        create: function() {
          return {
            save: function(callback) {
              return callback(null);
            }
          };
        }
      };
      workersMock.get = function() {
        done();
      };
      getModule().startJob('jobName');
    });

    it('should run job process if worker exist', function(done) {
      jobMock = {
        create: function() {
          return {
            save: function(callback) {
              return callback(null);
            }
          };
        },
        process: function() { done();}
      };
      workersMock.get = function() {
        return 1;
      };
      getModule().startJob('jobName');
    });

    it('should run job with worker function if worker exist', function(done) {
      jobMock = {
        create: function() {
          return {
            save: function(callback) {
              return callback(null);
            }
          };
        },
        process: function(name, callback) {
          return callback();
        }
      };
      workersMock.get = function() {
        return {
          getWorkerFunction: function() {
            done();
          }
        };
      };
      getModule().startJob('jobName');
    });

    it('should reject if worker does not exist', function(done) {
      jobMock = {
        create: function() {
          return {
            save: function(callback) {
              return callback(null);
            }
          };
        },
        process: function(name, callback) {
          return callback();
        }
      };
      workersMock.get = function() {};
      getModule().startJob('jobName').then(null, function() {
        done();
      });
    });

  });

  describe('The getJobById function', function() {

    it('should getJobById with correct parameters ', function(done) {
      kueMock.Job.get = function(value) {
        expect(value).to.equal(1234);
        done();
      };
      getModule().getJobById(1234);
    });

    it('should resolve job if job is found', function(done) {
      kueMock.Job.get = function(value, callback) {
        return callback(null, 'job');
      };
      getModule().getJobById(1234).then(function(job) {
        expect(job).to.equal('job');
        done();
      });
    });

    it('should reject if fail creating job', function(done) {
      kueMock.Job.get = function(value, callback) {
        return callback('error');
      };
      getModule().getJobById(1234).then(null, function(err) {
        expect(err).to.equal('error');
        done();
      });
    });

  });
});