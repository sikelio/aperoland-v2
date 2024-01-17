export interface Track {
  title: string,
  artist: string
  previewUrl: string,
  imageUrl: string
  songId: string
}

export interface CallbackTrack {
  title: string,
  artist: string
  spotifyPreviewUrl: string,
  spotifyImageUrl: string
  playlistId: number
}
