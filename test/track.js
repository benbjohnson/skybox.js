describe('Track', function(){

  var Track = require('track.js/lib/track')
    , nextTick = require('next-tick')
    , assert = require('assert')
    , equals = require('equals');

  var track = null;
  beforeEach(function() {
    track = new Track();
    track.options({mode:"test", device:{mode:"test"}});
    track.host = null;
    track.resource("/index.html");
  });

  describe('#initialize()', function(){
    it('should be initialized', function(){
      track.initialize();
      assert(track.initialized == true);
    });

    it('should set cookie options', function(){
      track.initialize({cookie: {maxage: 100}});
      assert(track.cookie.options().maxage == 100);
    });

    it('should set user options', function(){
      track.initialize({user: {foo: "bar"}});
      assert(track.user.options().foo == "bar");
    });
  });

  describe('#identify', function () {
    beforeEach(function() {
      track.cookie.set("ldmk_user_id", null);
    });

    it('should set the user id only', function(){
      track.identify("foo");
      assert(track.user.id() == "foo");
    });

    it('should set the user id and traits', function(){
      track.identify("foo", {"name":"bob"});
      assert(track.user.id() == "foo");
      assert(track.user.traits().name == "bob");
    });

    it('should set the traits only', function(){
      track.identify({"name":"susy"});
      assert(track.user.id() == null);
      assert(track.user.traits().name == "susy");
    });
  });

  describe('#track', function () {
    it('should not track without traits or event', function(done){
      track.identify("foo", function(success, url) {
        assert(!success);
        done();
      });
    });

    it('should track traits-only', function(done){
      track.identify("foo", {name:"john"}, function(success, url) {
        assert(url == track._trackurl({user:{id:"foo", traits:{name:"john"}}, device:{id:"x"}}), url);
        done();
      });
    });

    it('should track action-only', function(done){
      track.track("Page View", function(success, url) {
        assert(equals(track._parsetrackurl(url), {
          event:{
            channel: "Web",
            resource: "/index.html",
            action: "Page View",
          },
          device:{id:"x"}
        }));
        done();
      });
    });

    it('should track action and properties', function(done){
      track.track("Page View", {total_price:100}, function(success, url) {
        assert(equals(track._parsetrackurl(url), {
          event:{
            channel: "Web",
            resource: "/index.html",
            action: "Page View",
            total_price: 100,
          },
          device:{id:"x"}
        }));
        done();
      });
    });

    it('should track identity then event', function(done){
      track.identify("foo", {name:"John"});
      track.track("Click", function(success, url) {
        assert(equals(track._parsetrackurl(url), {
          user:{
            id: "foo",
            traits: {name:"John"}
          },
          event:{
            channel: "Web",
            resource: "/index.html",
            action: "Click",
          },
          device:{id:"x"}
        }));
        done();
      });
    });

    it('should track event then identity', function(done){
      track.track("Click", function(success, url) {
        assert(equals(track._parsetrackurl(url), {
          user:{
            id: "foo",
            traits: {name:"John"}
          },
          event:{
            channel: "Web",
            resource: "/index.html",
            action: "Click",
          },
          device:{id:"x"}
        }));
        done();
      });
      track.identify("foo", {name:"John"});
    });
  });
});
