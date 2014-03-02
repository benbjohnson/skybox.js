describe('Track', function(){
  var Track = require('track.js/lib/track'),
      querystring = require('querystring'),
      assert = chai.assert;

  var track = null;
  beforeEach(function() {
    track = new Track();
    track.options({mode:"test", device:{mode:"test"}});
    track.host = null;
  });

  afterEach(function() {
    if (document.body.lastChild.tagName == "img") {
      document.body.removeChild(document.body.lastChild);
    }
  });

  describe('#initialize()', function(){
    it('should be initialized', function(){
      track.initialize("");
      assert.equal(track.initialized, true);
    });

    it('should set api key', function(){
      track.initialize("API_KEY");
      assert.equal(track.apiKey, "API_KEY");
    });

    it('should set cookie options', function(){
      track.initialize("API_KEY", {cookie: {maxage: 100}});
      assert(track.cookie.options().maxage == 100);
    });

    it('should set user options', function(){
      track.initialize("API_KEY", {user: {foo: "bar"}});
      assert(track.user.options().foo == "bar");
    });
  });

  describe('#identify', function () {
    beforeEach(function() {
      track.cookie.set("trackjs_UserID", null);
    });

    it('should set the user id', function(){
      track.identify("foo");
      assert(track.user.id() == "foo");
    });
  });

  describe('#track', function () {
    beforeEach(function() {
      track.initialize("API_KEY")
    });

    it('should track page', function(){
      track.domain = sinon.stub().returns("google.com");
      track.path = sinon.stub().returns("/users/123/projects/456");
      track.page();

      var url = document.body.lastChild.src;
      var q = querystring.parse(url.substr(url.indexOf("?")+1))
      assert.equal(q["channel"], "web");
      assert.equal(q["resource"], "/users/:id/projects/:id");
      assert.equal(q["action"], "view");
      assert.equal(q["domain"], "google.com");
      assert.equal(q["path"], "/users/123/projects/456");
      assert.equal(q["apiKey"], "API_KEY");
      assert.strictEqual(q["user.id"], undefined);
      assert.equal(q["device.id"].length, 32);
    });

    it('should track page with identified user', function(){
      track.identify(123);
      track.page();

      var url = document.body.lastChild.src;
      var q = querystring.parse(url.substr(url.indexOf("?")+1))
      assert.equal(q["user.id"], "123");
    });

    it('should not track before initialization', function(){
      track.log = sinon.spy();
      track.initialized = false;
      track.page();
      assert.equal(track.log.getCall(0).args[0], "tracking not allowed before initialization");
    });
  });

  describe('#resource', function () {
    it('should return a normalized path', function(){
      track.path = sinon.stub().returns("/users/1/projects/456");
      assert.equal(track.resource(), "/users/:id/projects/:id")
    });

    it('should use resource value', function(){
      track.resource("foo");
      assert.equal(track.resource(), "foo");
    });

    it('should use resource function', function(){
      track.resource(function() { return "bar"; });
      assert.equal(track.resource(), "bar");
    });
  });

  describe('#url', function () {
    it('should return url', function(){
      assert.equal(track.url("/foo", {bar:"baz"}), "http://localhost/foo?bar=baz")
    });

    it('should return url with host', function(){
      track.host = "google.com";
      assert.equal(track.url("/foo"), "http://google.com/foo")
    });

    it('should return url with port', function(){
      track.port = 2000;
      assert.equal(track.url("/foo"), "http://localhost:2000/foo")
    });
  });
});
