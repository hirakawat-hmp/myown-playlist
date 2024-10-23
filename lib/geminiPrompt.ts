import { SchemaType } from "@google/generative-ai";

export const genreList: string[] = [
  "acoustic",
  "afrobeat",
  "alt-rock",
  "alternative",
  "ambient",
  "anime",
  "black-metal",
  "bluegrass",
  "blues",
  "bossanova",
  "brazil",
  "breakbeat",
  "british",
  "cantopop",
  "chicago-house",
  "children",
  "chill",
  "classical",
  "club",
  "comedy",
  "country",
  "dance",
  "dancehall",
  "death-metal",
  "deep-house",
  "detroit-techno",
  "disco",
  "disney",
  "drum-and-bass",
  "dub",
  "dubstep",
  "edm",
  "electro",
  "electronic",
  "emo",
  "folk",
  "forro",
  "french",
  "funk",
  "garage",
  "german",
  "gospel",
  "goth",
  "grindcore",
  "groove",
  "grunge",
  "guitar",
  "happy",
  "hard-rock",
  "hardcore",
  "hardstyle",
  "heavy-metal",
  "hip-hop",
  "holidays",
  "honky-tonk",
  "house",
  "idm",
  "indian",
  "indie",
  "indie-pop",
  "industrial",
  "iranian",
  "j-dance",
  "j-idol",
  "j-pop",
  "j-rock",
  "jazz",
  "k-pop",
  "kids",
  "latin",
  "latino",
  "malay",
  "mandopop",
  "metal",
  "metal-misc",
  "metalcore",
  "minimal-techno",
  "movies",
  "mpb",
  "new-age",
  "new-release",
  "opera",
  "pagode",
  "party",
  "philippines-opm",
  "piano",
  "pop",
  "pop-film",
  "post-dubstep",
  "power-pop",
  "progressive-house",
  "psych-rock",
  "punk",
  "punk-rock",
  "r-n-b",
  "rainy-day",
  "reggae",
  "reggaeton",
  "road-trip",
  "rock",
  "rock-n-roll",
  "rockabilly",
  "romance",
  "sad",
  "salsa",
  "samba",
  "sertanejo",
  "show-tunes",
  "singer-songwriter",
  "ska",
  "sleep",
  "songwriter",
  "soul",
  "soundtracks",
  "spanish",
  "study",
  "summer",
  "swedish",
  "synth-pop",
  "tango",
  "techno",
  "trance",
  "trip-hop",
  "turkish",
  "work-out",
  "world-music",
];

export const systemPrompt: string = `
あなたは楽曲マイスターです。直接楽曲を推薦するのではなく、音楽の特徴を推薦します。
具体的には、
export interface NumericAudioFeatures {
  acousticness: number;
  // A confidence measure from 0.0 to 1.0 of whether the track is acoustic.
  // 1.0 represents high confidence the track is acoustic.
  // Range: 0 - 1
  // Example: 0.00242

  danceability: number;
  // Danceability describes how suitable a track is for dancing based on a combination
  // of musical elements including tempo, rhythm stability, beat strength, and overall regularity.
  // A value of 0.0 is least danceable and 1.0 is most danceable.
  // Example: 0.585

  energy: number;
  // Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity
  // and activity. Typically, energetic tracks feel fast, loud, and noisy. For example,
  // death metal has high energy, while a Bach prelude scores low on the scale.
  // Perceptual features contributing to this attribute include dynamic range, perceived
  // loudness, timbre, onset rate, and general entropy.
  // Example: 0.842

  instrumentalness: number;
  // Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as
  // instrumental in this context. Rap or spoken word tracks are clearly "vocal".
  // The closer the instrumentalness value is to 1.0, the greater likelihood the track
  // contains no vocal content. Values above 0.5 are intended to represent instrumental tracks,
  // but confidence is higher as the value approaches 1.0.
  // Example: 0.00686

  liveness: number;
  // Detects the presence of an audience in the recording. Higher liveness values represent
  // an increased probability that the track was performed live. A value above 0.8 provides
  // strong likelihood that the track is live.
  // Example: 0.0866

  loudness: number;
  // The overall loudness of a track in decibels (dB). Loudness values are averaged across
  // the entire track and are useful for comparing relative loudness of tracks. Loudness is
  // the quality of a sound that is the primary psychological correlate of physical strength (amplitude).
  // Values typically range between -60 and 0 db.
  // Example: -5.883

  speechiness: number;
  // Speechiness detects the presence of spoken words in a track. The more exclusively speech-like
  // the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value.
  // Values above 0.66 describe tracks that are probably made entirely of spoken words.
  // Values between 0.33 and 0.66 describe tracks that may contain both music and speech,
  // either in sections or layered, including such cases as rap music. Values below 0.33 most likely
  // represent music and other non-speech-like tracks.
  // Example: 0.0556

  tempo: number;
  // The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo
  // is the speed or pace of a given piece and derives directly from the average beat duration.
  // Example: 118.211;

  valence: number;
  // A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track.
  // Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric),
  // while tracks with low valence sound more negative (e.g. sad, depressed, angry).
  // Range: 0 - 1
  // Example: 0.428
}
  のような特徴を提案します。
  ユーザーから人物の写真が与えられます。その写真からその人物をプロファイリングし、
  その人物にあった楽曲の特徴量を提案します。
  また、楽曲のジャンルも提案します。  以下より、ジャンルを５つまで選択すること。
  ユーザーは日本人なので、日本人の視聴傾向を踏まえてジャンルを選択してください。
  ジャンルは優先度が高い順番に選択してください。
  ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"];
  
  また、その際にプロファイリングしたその人の情報と、提案した特徴量を言語化し、またその提案理由を説明します。
  これをstoryという変数に格納し、返り値として提供します。

  Return: {
    acousticness: number;
    danceability: number;
    energy: number;
    instrumentalness: number;
    liveness: number;
    loudness: number;
    speechiness: number;
    tempo: number;
    valence: number;
    story: string;
    genre: string[];
    }
`;

export const geminiPrompt: string = `
`;

export const schema = {
  description: "A schema for a audio feature",
  type: SchemaType.OBJECT,
  properties: {
    acousticness: {
      description:
        "A confidence measure from 0.0 to 1.0 of whether the track is acoustic.",
      type: SchemaType.NUMBER,
      nullable: false,
    },
    danceability: {
      description:
        "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.",
      type: SchemaType.NUMBER,
      nullable: false,
    },
    energy: {
      description:
        "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity.",
      type: SchemaType.NUMBER,
      nullable: false,
    },
    instrumentalness: {
      description: "Predicts whether a track contains no vocals.",
      type: SchemaType.NUMBER,
      nullable: false,
    },
    liveness: {
      description: "Detects the presence of an audience in the recording.",
      type: SchemaType.NUMBER,
      nullable: false,
    },
    loudness: {
      description: "The overall loudness of a track in decibels (dB).",
      type: SchemaType.NUMBER,
      nullable: false,
    },
    speechiness: {
      description:
        "Speechiness detects the presence of spoken words in a track.",
      type: SchemaType.NUMBER,
      nullable: false,
    },
    tempo: {
      description:
        "The overall estimated tempo of a track in beats per minute (BPM).",
      type: SchemaType.NUMBER,
      nullable: false,
    },
    valence: {
      description:
        "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track.",
      type: SchemaType.NUMBER,
      nullable: false,
    },
    story: {
      description: "A short story about the track.",
      type: SchemaType.STRING,
      nullable: false,
    },
    genre: {
      description: "A list of genre that the track belongs to.",
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
      nullable: false,
    },
  },
  required: [
    "acousticness",
    "danceability",
    "energy",
    "instrumentalness",
    "liveness",
    "loudness",
    "speechiness",
    "tempo",
    "valence",
    "story",
    "genre",
  ],
};
