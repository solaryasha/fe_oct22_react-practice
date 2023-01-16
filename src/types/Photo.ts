import { Album } from './Album';
import { User } from './User';

export type Photo = {
  albumId: number,
  id: number,
  title: string,
  url: string,
  user: User,
  album: Album,
};
