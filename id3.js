var ID3 = (function() {
  ID3 = {};

  var textDecoder = new TextDecoder("utf-8");

  function rmPadding(tag) {
    var index = tag.indexOf('\u0000');
    if (index !== -1)
      return tag.slice(0, index);

    return tag;
  }

  function ID3v1Parser() {
  }

  ID3v1Parser.prototype = {
    parse: function(view) {
      var tags = {
        title: null,
        artist: null,
        album: null,
        year: null,
        comment: null,
        track: null,
        genre: null
      };
      view = view.subarray(view.byteLength - 128 + 3);

      var title = textDecoder.decode(view.subarray(0, 30));
      tags.title = rmPadding(title);

      var artist = textDecoder.decode(view.subarray(30, 60));
      tags.artist = rmPadding(artist);

      var album = textDecoder.decode(view.subarray(60, 90));
      tags.album = rmPadding(album);

      var year = textDecoder.decode(view.subarray(90, 94));
      tags.year = rmPadding(year);

      var comment =
        textDecoder.decode(view.subarray(94, 124));
      tags.comment = rmPadding(comment);

      if (view[122] === 0)
        tags.track = view[123];

      tags.genre = ID3.genres[view[124]];

      return tags;
    }
  };

  ID3.genres = [
    'Blues',
    'Classic Rock',
    'Country',
    'Dance',
    'Disco',
    'Funk',
    'Grunge',
    'Hip-Hop',
    'Jazz',
    'Metal',
    'New Age',
    'Oldies',
    'Other',
    'Pop',
    'R&B',
    'Rap',
    'Reggae',
    'Rock',
    'Techno',
    'Industrial',
    'Alternative',
    'Ska',
    'Death Metal',
    'Pranks',
    'Soundtrack',
    'Euro-Techno',
    'Ambient',
    'Trip-Hop',
    'Vocal',
    'Jazz+Funk',
    'Fusion',
    'Trance',
    'Classical',
    'Instrumental',
    'Acid',
    'House',
    'Game',
    'Sound Clip',
    'Gospel',
    'Noise',
    'AlternRock',
    'Bass',
    'Soul',
    'Punk',
    'Space',
    'Meditative',
    'Instrumental Pop',
    'Instrumental Rock',
    'Ethnic',
    'Gothic',
    'Darkwave',
    'Techno-Industrial',
    'Electronic',
    'Pop-Folk',
    'Eurodance',
    'Dream',
    'Southern Rock',
    'Comedy',
    'Cult',
    'Gangsta Rap',
    'Top 40',
    'Christian Rap',
    'Pop / Funk',
    'Jungle',
    'Native American',
    'Cabaret',
    'New Wave',
    'Psychedelic',
    'Rave',
    'Showtunes',
    'Trailer',
    'Lo-Fi',
    'Tribal',
    'Acid Punk',
    'Acid Jazz',
    'Polka',
    'Retro',
    'Musical',
    'Rock & Roll',
    'Hard Rock',
    'Folk',
    'Folk-Rock',
    'National Folk',
    'Swing',
    'Fast Fusion',
    'Bebob',
    'Latin',
    'Revival',
    'Celtic',
    'Bluegrass',
    'Avantgarde',
    'Gothic Rock',
    'Progressive Rock',
    'Psychedelic Rock',
    'Symphonic Rock',
    'Slow Rock',
    'Big Band',
    'Chorus',
    'Easy Listening',
    'Acoustic',
    'Humour',
    'Speech',
    'Chanson',
    'Opera',
    'Chamber Music',
    'Sonata',
    'Symphony',
    'Booty Bass',
    'Primus',
    'Porn Groove',
    'Satire',
    'Slow Jam',
    'Club',
    'Tango',
    'Samba',
    'Folklore',
    'Ballad',
    'Power Ballad',
    'Rhythmic Soul',
    'Freestyle',
    'Duet',
    'Punk Rock',
    'Drum Solo',
    'A Cappella',
    'Euro-House',
    'Dance Hall',
    'Goa',
    'Drum & Bass',
    'Club-House',
    'Hardcore',
    'Terror',
    'Indie',
    'BritPop',
    'Negerpunk',
    'Polsk Punk',
    'Beat',
    'Christian Gangsta Rap',
    'Heavy Metal',
    'Black Metal',
    'Crossover',
    'Contemporary Christian',
    'Christian Rock',
    'Merengue',
    'Salsa',
    'Thrash Metal',
    'Anime',
    'JPop',
    'Synthpop',
    'Rock/Pop'
  ];

  ID3.ID3v1Parser = ID3v1Parser;

  return ID3;
}());