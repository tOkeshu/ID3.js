// We can't have a latin1 encoder here, so we use utf-8 and make sure
// we don't use non-ascii characters.
var utf8 = new TextEncoder("utf-8");

var createMP3 = function(options) {
  var buffer = new ArrayBuffer(4 + 128); // junk + tags
  var view = new Uint8Array(buffer);
  var junk = utf8.encode("JUNK");
  var tag  = utf8.encode("TAG");
  var offset = junk.byteLength + tag.byteLength;

  view.set(junk);
  view.set(tag, junk.byteLength);

  options = options || {};

  if (options.title)
    view.set(utf8.encode(options.title), offset);
  if (options.artist)
    view.set(utf8.encode(options.artist), offset + 30);
  if (options.album)
    view.set(utf8.encode(options.album), offset + 60);
  if (options.year)
    view.set(utf8.encode(options.year), offset + 90);
  if (options.comment)
    view.set(utf8.encode(options.comment), offset + 94);
  if (options.track)
    view.set([0, options.track], offset + 122);
  if (options.genre)
    view.set([ID3.genres.indexOf(options.genre)], offset + 124)

  return view;
};

var createMP3v2 = function(options) {
  var buffer = new ArrayBuffer(128 + 4); // tags + junk
  var view = new Uint8Array(buffer);
  var header = new Uint8Array(10);
  var junk = utf8.encode("JUNK");

  // var header   = new Uint8Array([73, 68, 51, 3, 0, 0]);
  var id3     = utf8.encode("ID3");
  var version = new Uint8Array([3, 0]);
  var flags   = new Uint8Array([0]);
  var size, frames = {};

  header.set(id3);
  header.set(version, id3.byteLength);
  header.set(flags,   id3.byteLength + version.byteLength);

  options = options || {};

  if (options.title)
    frames["TIT2"] = utf8.encode("\u0000" + options.title);
  if (options.artist)
    frames["TPE1"] = utf8.encode("\u0000" + options.artist);
  if (options.album)
    frames["TALB"] = utf8.encode("\u0000" + options.album);
  if (options.year)
    frames["TYER"] = utf8.encode("\u0000" + options.year);
  if (options.track)
    frames["TRCK"] = utf8.encode("\u0000" + options.track);

  size = Object.keys(frames).reduce(function(size, id) {
    size += 10 + frames[id].byteLength;
    return size;
  }, 0);

  // XXX: size can be greater than 256;
  header[9] = size;

  var cursor = 0;
  var tag = Object.keys(frames).reduce(function(tag, id) {
    var frame = frames[id];
    tag.set(utf8.encode(id), cursor);
    tag.set([0, 0, 0, frame.byteLength], cursor + 4);
    tag.set([0, 0], cursor + 8);
    tag.set(frame, cursor + 10);
    cursor += (10 + frame.byteLength);
    return tag;
  }, new Uint8Array(size));

  var mp3 = new Uint8Array(header.byteLength + tag.byteLength + 4);
  mp3.set(header);
  mp3.set(tag, header.byteLength);
  mp3.set(junk, header.byteLength + tag.byteLength);

  return mp3;
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

    it("should extract multiple tags", function() {
      var mp3 = createMP3({title: "Much Tags, Wow", track: 10});
      var tags = parser.parse(mp3);
      expect(tags.title).to.equal("Much Tags, Wow");
      expect(tags.track).to.equal(10);
    });

  });

});

describe("ID3v2Parser", function() {

  describe("#parse", function() {
    var parser;

    beforeEach(function() {
      parser = new ID3.ID3v2Parser();
    });

    it("should extract the title", function() {
      var mp3 = createMP3v2({title: "A title"});
      var tags = parser.parse(mp3);
      expect(tags.title).to.equal("A title");
    });

    it("should extract the artist", function() {
      var mp3 = createMP3v2({artist: "Best artist EVAR"});
      var tags = parser.parse(mp3);
      expect(tags.artist).to.equal("Best artist EVAR");
    });

    it("should extract the album", function() {
      var mp3 = createMP3v2({album: "Best of"});
      var tags = parser.parse(mp3);
      expect(tags.album).to.equal("Best of");
    });

    it("should extract the year", function() {
      var mp3 = createMP3v2({year: "1984"});
      var tags = parser.parse(mp3);
      expect(tags.year).to.equal("1984");
    });

    it("should extract the comment");

    it("should extract the track number", function() {
      var mp3 = createMP3v2({track: 10});
      var tags = parser.parse(mp3);
      expect(tags.track).to.equal(10);
    });

    it("should extract the genre");

    it("should extract multiple frames", function() {
      var mp3 = createMP3v2({title: "Much Tags, Wow", track: 10});
      var tags = parser.parse(mp3);
      expect(tags.title).to.equal("Much Tags, Wow");
      expect(tags.track).to.equal(10);
    });

  });

});

