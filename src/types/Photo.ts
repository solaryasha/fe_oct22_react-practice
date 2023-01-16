import { Album } from './Album';
import { User } from './User';

export interface Photo{
  id: number,
  title: string,
  albumId: number,
  url: string,
}

export interface Prepared extends Photo {
  album: Album | null,
  user: User | null,
}
