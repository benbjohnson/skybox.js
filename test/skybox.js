describe('Skybox', function(){
  var Skybox = require('skybox/lib/skybox'),
      querystring = require('querystring'),
      assert = chai.assert;

  var skybox = null;
  beforeEach(function() {
    skybox = new Skybox();
    skybox.options({mode:"test", device:{mode:"test"}});
    skybox.host = null;
  });

  afterEach(function() {
    if (document.body.lastChild.tagName == "img") {
      document.body.removeChild(document.body.lastChild);
    }
  });

  describe('#initialize()', function(){
    it('should be initialized', function(){
      skybox.initialize("");
      assert.equal(skybox.initialized, true);
    });

    it('should set api key', function(){
      skybox.initialize("API_KEY");
      assert.equal(skybox.apiKey, "API_KEY");
    });

    it('should set cookie options', function(){
      skybox.initialize("API_KEY", {cookie: {maxage: 100}});
      assert(skybox.cookie.options().maxage == 100);
    });

    it('should set user options', function(){
      skybox.initialize("API_KEY", {user: {foo: "bar"}});
      assert(skybox.user.options().foo == "bar");
    });
  });

  describe('#identify', function () {
    beforeEach(function() {
      skybox.cookie.set("skybox_UserID", null);
    });

    it('should set the user id', function(){
      skybox.identify("foo");
      assert(skybox.user.id() == "foo");
    });
  });

  describe('#skybox', function () {
    beforeEach(function() {
      skybox.initialize("API_KEY")
    });

    it('should track page', function(){
      skybox.domain = sinon.stub().returns("google.com");
      skybox.path = sinon.stub().returns("/users/123/projects/456");
      skybox.page();

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
      skybox.identify(123);
      skybox.page();

      var url = document.body.lastChild.src;
      var q = querystring.parse(url.substr(url.indexOf("?")+1))
      assert.equal(q["user.id"], "123");
    });

    it('should not track before initialization', function(){
      skybox.log = sinon.spy();
      skybox.initialized = false;
      skybox.page();
      assert.equal(skybox.log.getCall(0).args[0], "tracking not allowed before initialization");
    });
  });

  describe('#resource', function () {
    it('should return a normalized path', function(){
      skybox.path = sinon.stub().returns("/users/1/projects/456");
      assert.equal(skybox.resource(), "/users/:id/projects/:id")
    });

    it('should use resource value', function(){
      skybox.resource("foo");
      assert.equal(skybox.resource(), "foo");
    });

    it('should use resource function', function(){
      skybox.resource(function() { return "bar"; });
      assert.equal(skybox.resource(), "bar");
    });
  });

  describe('#url', function () {
    it('should return url', function(){
      assert.equal(skybox.url("/foo", {bar:"baz"}), "http://localhost/foo?bar=baz")
    });

    it('should return url with host', function(){
      skybox.host = "google.com";
      assert.equal(skybox.url("/foo"), "http://google.com/foo")
    });

    it('should return url with port', function(){
      skybox.port = 2000;
      assert.equal(skybox.url("/foo"), "http://localhost:2000/foo")
    });
  });
});
