import { getUserById } from './getUserById';
import albumsFromServer from '../api/albums';
import { FullAlbum } from '../types/Album';

export const getPreparedAlbumn = (): FullAlbum[] => {
  return albumsFromServer.map(album => ({
    ...album,
    user: getUserById(album.id),
  }));
};
