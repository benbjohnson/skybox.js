describe('User', function(){

  var User = require('track.js/lib/user')
    , assert = require('assert')
    , equals = require('equals');

  var user = null;

  beforeEach(function() {
    user = new User();
  });

  describe('#id()', function(){
    it('should set and retrieve', function(){
      user.id(12);
      assert(user.id() == 12);
    });
  });

  describe('#identify()', function(){
    it('should set id', function(){
      user.identify("100");
      assert(user.id() == "100");
    });
  });

  describe('#logout()', function(){
    it('should clear id', function(){
      user.identify("100");
      user.logout();
      assert(user.id() === null);
    });
  });

  describe('#serialize()', function(){
    it('should serialize id', function(){
      user.identify("100");
      assert(equals(user.serialize(), {id:"100"}));
    });
  });
});
