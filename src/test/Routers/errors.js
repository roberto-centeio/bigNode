const request = require('supertest');
const expect = require('expect')
const app = require('../../lib/server').server

if (!app.domain){
  require('../../index')
  const app = require('../../lib/server').server
}

describe('test /errors', function () {
    it('should return 200', function (done) {
      request(app)
        .post("/errors")
        .send({"errors":"ok"})
        .expect(200)
        .end(done); 
    })
});
