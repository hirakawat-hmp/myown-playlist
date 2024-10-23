// spotify API で 取得するトラック情報
export interface Track {
  preview_url: string | null;
  name: string;
  artists: Array<{ name: string }>;
  id: string;
  album: {
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
}

// 使用するトラックの楽曲的な特徴量
export interface NumericAudioFeatures {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  valence: number;
}

// アプリ内で扱うトラック情報
export interface TrackInfoMeta {
  preview_url: string | null;
  name: string;
  artists: string;
  id: string;
  albumImageUrl: string | NULL;
}

export interface TrackInfo extends TrackInfoMeta {
  audioFeatures: NumericAudioFeatures;
}

// spotify recommendation api の 引数
export interface ReccomendationProps {
  market: string;
  limit: number;
  seed_artists: string[];
  seed_genres: string[];

  target_acousticness: number;
  target_danceability: number;
  target_energy: number;
  target_instrumentalness: number;
  target_liveness: number;
  target_loudness: number;
  target_speechiness: number;
  target_tempo: number;
  target_valence: number;
}

// export interface NumericRecommendationsProps {
//   target_acousticness: number;
//   target_danceability: number;
//   target_energy: number;
//   target_instrumentalness: number;
//   target_liveness: number;
//   target_loudness: number;
//   target_speechiness: number;
//   target_tempo: number;
//   target_valence: number;
//   seed_genres: string[];
// }
