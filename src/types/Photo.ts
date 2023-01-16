import { FullAlbum } from './Album';

export interface Photo {
  albumId: number,
  id: number,
  title: string,
  url: string,
}

export interface FullPhoto extends Photo {
  album?: FullAlbum
}
