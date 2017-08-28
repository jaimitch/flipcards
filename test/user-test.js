const assert = require('chai').assert;
const app = require('../app');

describe('Users:models', function(){
    describe('#hashPassword()', function(){
        it('should return a hashed password asynchronously', function(done) {
            var password = 'smellycatfriend';

            User.hashPassword(password, function(err, passwordHash){
                //Confirm error does not exist
                should.not.exist(err);
                //Confirm the passwordHash is notNull
                should.exist(passwordHash);
                done()
            });
        });
    });
});