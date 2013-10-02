var assert = require('assert'),
    expect = require('expect.js'),
    app = require('../app').app,
    Book = require('../lib/book.js');
    //mySparqlService = require('../lib/sparqlservice.js');

describe('BOOK API', function() {

  describe('book lookup', function() {

    var config = {"endpoint": "http://data.deichman.no/sparqlz",
                  "base_uri": "http://data.deichman.no/resource/tnr_"};
    var book = new Book(config);
    
    it('creates a book from tnr', function(){
      book.from_tnr(1, function() {
        expect(book.tnr).to.equal(1);
      });
    });

    it('creates a book uri', function(done){
      book.from_tnr(1, function() {
        expect(book.uri).to.equal('http://data.deichman.no/resource/tnr_1');
        done();
      });
    });

    it('creates a book uri from configuration', function(done){
      var config = {"endpoint": "http://data.deichman.no/sparql",
                     "base_uri": "http://data.lillehammer.no/resource/tnr_"};
      var book = new Book(config);
      book.from_tnr(1, function() {
        expect(book.uri).to.equal('http://data.lillehammer.no/resource/tnr_1');
        done();
      });
    });    
 
    it('returns valid format for audiobook', function(done){
      book.from_tnr(974232, function() {
        expect(book.validFormat()).to.equal(true); 
        done();
      });      
    });

    it('returns valid even if only one of many formats is valid', function(done){
      book.from_tnr(1447893, function() {
        expect(book.validFormat()).to.equal(true); 
        done();
      });
    });

    it('returns invalid format for music CD', function(done){
      book.from_tnr(1031239, function() {
        expect(book.validFormat()).to.equal(false); 
        done();
      });
    });

    it('returns title when a book has an accepted format', function(done){
      book.from_tnr(974232, function() {
        expect(book.title).to.equal("Morgen i Jenin"); 
        done();
      });
    });


  });

});
