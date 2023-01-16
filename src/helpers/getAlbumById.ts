import { Album } from '../types/Album';

export const getAlbumById = (id: number, albums:Album[]): Album | undefined => {
  return albums.find(album => id === album.id);
};
