var textEncoder = new TextEncoder("utf-8");
var textDecoder = new TextDecoder("utf-8");

var createMP3 = function(options) {
  var buffer = new ArrayBuffer(4 + 128); // junk + tags
  var view = new Uint8Array(buffer);
  var junk = textEncoder.encode("JUNK");
  var tag  = textEncoder.encode("TAG");
  var offset = junk.byteLength + tag.byteLength;

  view.set(junk);
  view.set(tag, junk.byteLength);

  options = options || {};

  if (options.title)
    view.set(textEncoder.encode(options.title), offset);
  if (options.artist)
    view.set(textEncoder.encode(options.artist), offset + 30);
  if (options.album)
    view.set(textEncoder.encode(options.album), offset + 60);
  if (options.year)
    view.set(textEncoder.encode(options.year), offset + 90);
  if (options.comment)
    view.set(textEncoder.encode(options.comment), offset + 94);
  if (options.track)
    view.set([0, options.track], offset + 122);
  if (options.genre)
    view.set([ID3.genres.indexOf(options.genre)], offset + 124)

  console.log(textDecoder.decode(view));

  return view;
};

describe("ID3v1Parser", function() {

  describe("#parse", function() {
    var parser;

    beforeEach(function() {
      parser = new ID3.ID3v1Parser();
    });

    it("should extract the title", function() {
      var mp3 = createMP3({title: "A title"});
      var tags = parser.parse(mp3);
      expect(tags.title).to.equal("A title");
    });

    it("should extract the artist", function() {
      var mp3 = createMP3({artist: "Best artist EVAR"});
      var tags = parser.parse(mp3);
      expect(tags.artist).to.equal("Best artist EVAR");
    });

    it("should extract the album", function() {
      var mp3 = createMP3({album: "Best of"});
      var tags = parser.parse(mp3);
      expect(tags.album).to.equal("Best of");
    });

    it("should extract the year", function() {
      var mp3 = createMP3({year: "1984"});
      var tags = parser.parse(mp3);
      expect(tags.year).to.equal("1984");
    });

    it("should extract the comment", function() {
      var mp3 = createMP3({comment: "tis a silly song"});
      var tags = parser.parse(mp3);
      expect(tags.comment).to.equal("tis a silly song");
    });

    it("should extract the track number", function() {
      var mp3 = createMP3({track: 10});
      var tags = parser.parse(mp3);
      expect(tags.track).to.equal(10);
    });

    it("should extract the genre", function() {
      var mp3 = createMP3({genre: 'Metal'});
      var tags = parser.parse(mp3);
      expect(tags.genre).to.equal('Metal');
    });

  });

});

