import { User } from './Users';

export interface Album {
  userId: number,
  id: number,
  title: string,
}

export interface AlbumWithUser extends Album {
  user?: User,
}
