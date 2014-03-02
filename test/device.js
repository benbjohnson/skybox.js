describe('Device', function(){

  var Device = require('track.js/lib/device'),
      assert = chai.assert;;

  var device = null;

  beforeEach(function() {
    device = new Device();
  });

  describe('#id()', function(){
    it('should be 32 characters', function(){
      assert.equal(device.id().length, 32);
    });
  });

  describe('#serialize()', function(){
    it('should serialize id only', function(){
      assert.deepEqual(device.serialize(), {id:device.id()});
    });
  });
});
