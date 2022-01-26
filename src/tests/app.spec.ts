// app.spect.ts
// ------------------------------------------------------------------------------------

const request = require("supertest");
const server = request.agent("http://localhost:5000");
const should = require('chai').should()
const expect = require('chai').expect
const assert = require('chai').assert

// ------------------------------------------------------------------------------------

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

// ------------------------------------------------------------------------------------

// API TESTS

describe('routes', function() {

    // Test to make sure URLs respond correctly.
     it("GET /categories/",  function(done) {
         server
            .get("/categories")
            // .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGco')
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function(err: any, res: any) {
                should.not.exist(err);
                should.exist(res);
                res.should.be.an('object');
                const data = res.body 
                expect(res.body[0]).to.have.property('_id');
                expect(res.body[0]).to.have.property('cat_flag_single');
                expect(res.body[0]).to.have.property('cat_description');
                res.body.should.be.an('array');
                res.body[0]._id.should.be.an('number')
                res.body[0].cat_flag_single.should.be.an('number')
                res.body[0].cat_description.should.be.an('string')
                done();
            });
     });

     it("GET /products/:id",  function(done) {
                 server
                    .get("/products/1")
                    // .set('Authorization', '')
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function(err: any, res: any) {
                        should.not.exist(err);
                        should.exist(res);
                        res.should.be.an('object');
                        res.body.should.be.an('object');
                        expect(res.body).to.have.property('_id');
                        expect(res.body).to.have.property('prod_title');
                        expect(res.body).to.have.property('prod_description');
                        expect(res.body).to.have.property('prod_price');
                        expect(res.body).to.have.property('category');
                        expect(res.body).to.have.property('images');
                        res.body.category.should.be.an('object');
                        expect(res.body.category).to.have.property('_id');
                        expect(res.body.category).to.have.property('cat_flag_single');
                        expect(res.body.category).to.have.property('cat_description');
                        res.body.images.should.be.an('array');
                        done();
                    });
             });

             it("POST /contacts",  function(done) {
                        const contact = { 
                            cont_name:  "Usuario Contacto",
                            cont_email:  "ucontact@gmailcom",
                            cont_comments: "Comentarios y consultas",
                            cont_date:  "01-01-1999"
                         };
                         server
                            .post("/contacts")
                            .send( contact )
                            .expect(200)
                            .end(function(err: any, res: any) {
                                should.not.exist(err);
                                done();
                            });
                     });
        
});


// ------------------------------------------------------------------------------------

// UNIT TESTS


import { encryptPassword, verifyPassword } from "../helpers/encrypt"

// describe: Definition of related test blocks.
describe('Helpers', function() {

    describe('Encrypt', function() {

        const userPassword = "SECRET PASSWORD"
        const userInvalidPassword = "SECRET INVALID PASSWORD"
        let encryptedKey: any = ""

        // Test case #1
        it("Encript Valid Password", async  function() {
            encryptedKey =  await encryptPassword(userPassword);
            expect( encryptedKey ).to.be.a( 'string' );
        });

        // Test case #2
        it("Verify Valid Password",   function() {
            const result : boolean =  verifyPassword(userPassword, encryptedKey)
            expect( result ).to.be.a( 'boolean' );
            assert.equal(result, true);
        });

        // Test case #3
        it("Verify Invalid Password",   function() {
            const result : boolean =  verifyPassword(userPassword, userInvalidPassword)
            expect( result ).to.be.a( 'boolean' );
            assert.equal(result, false);
        });

    });
});

// ------------------------------------------------------------------------------------
