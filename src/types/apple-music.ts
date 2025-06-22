export interface AppleMusicArtwork {
  url: string;
  width: number;
  height: number;
  bgColor?: string;
  textColor1?: string;
  textColor2?: string;
  textColor3?: string;
  textColor4?: string;
}

export interface AppleMusicArtist {
  id: string;
  type: "artists";
  href: string;
  attributes: {
    name: string;
    genreNames: string[];
    artwork?: AppleMusicArtwork;
    url?: string;
  };
}

export interface AppleMusicAlbum {
  id: string;
  type: "albums";
  href: string;
  attributes: {
    name: string;
    artistName: string;
    artwork: AppleMusicArtwork;
    genreNames: string[];
    releaseDate: string;
    trackCount: number;
    url?: string;
  };
  relationships?: {
    artists: {
      data: AppleMusicArtist[];
    };
    tracks?: {
      data: AppleMusicTrack[];
    };
  };
}

export interface AppleMusicTrack {
  id: string;
  type: "songs";
  href: string;
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    artwork: AppleMusicArtwork;
    genreNames: string[];
    releaseDate: string;
    durationInMillis: number;
    url?: string;
    previews?: {
      url: string;
    }[];
  };
  relationships?: {
    artists: {
      data: AppleMusicArtist[];
    };
    albums: {
      data: AppleMusicAlbum[];
    };
  };
}

export interface AppleMusicSearchResult {
  songs?: {
    data: AppleMusicTrack[];
    next?: string;
  };
  artists?: {
    data: AppleMusicArtist[];
    next?: string;
  };
  albums?: {
    data: AppleMusicAlbum[];
    next?: string;
  };
}

export interface AppleMusicResponse<T> {
  data: T[];
  next?: string;
  meta?: {
    total: number;
  };
}

export interface AppleMusicChart {
  chart: string;
  name: string;
  orderedTracks: AppleMusicTrack[];
  orderedAlbums: AppleMusicAlbum[];
  orderedArtists: AppleMusicArtist[];
}
