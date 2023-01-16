import { User } from './User';

export interface Album {
  userId: number,
  id: number,
  title: string,
}

export interface FullAlbum extends Album {
  user?: User
}
