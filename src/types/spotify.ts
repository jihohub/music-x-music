export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images?: SpotifyImage[];
  genres?: string[];
  popularity?: number;
  followers?: {
    total: number;
    href: string | null;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images?: SpotifyImage[];
  artists: SpotifyArtist[];
  release_date: string;
  total_tracks: number;
  tracks?: {
    items: SpotifyTrack[];
  };
  explicit?: boolean;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album?: SpotifyAlbum;
  duration_ms: number;
  preview_url?: string;
  popularity?: number;
  explicit?: boolean;
}

export interface SpotifySearchResult {
  tracks?: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
    next?: string | null;
  };
  artists?: {
    items: SpotifyArtist[];
    total: number;
    limit: number;
    offset: number;
    next?: string | null;
  };
  albums?: {
    items: SpotifyAlbum[];
    total: number;
    limit: number;
    offset: number;
    next?: string | null;
  };
}
