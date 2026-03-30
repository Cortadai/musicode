// Backend entity types — match Spring Boot JSON responses

export interface Track {
  id: number;
  title: string;
  trackNumber: number | null;
  discNumber: number | null;
  duration: number | null;
  filePath: string;
  fileSize: number | null;
  bitRate: number | null;
  sampleRate: number | null;
  bitsPerSample: number | null;
  year: number | null;
  genre: string | null;
  album: { id: number; title: string; year: number | null; hasCoverArt: boolean } | null;
  artist: { id: number; name: string } | null;
}

export interface Album {
  id: number;
  title: string;
  year: number | null;
  coverArtPath: string | null;
  hasCoverArt: boolean;
  artist: { id: number; name: string };
  tracks: Track[] | null;
}

export interface Artist {
  id: number;
  name: string;
  albums: Album[] | null;
  tracks: Track[] | null;
}

export interface SearchResults {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
}

export interface LibraryFolder {
  id: number;
  path: string;
  lastScannedAt: string | null;
  trackCount: number | null;
}

export interface ScanStatus {
  scanning: boolean;
  currentFolder: string | null;
  filesFound: number;
  filesProcessed: number;
  filesSkipped: number;
  errors: number;
  newTracks: number;
  updatedTracks: number;
  startedAt: string | null;
  completedAt: string | null;
}

// Spring Data Page response
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
