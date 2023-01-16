import { getPreparedAlbumn } from './getPreparedAlbums';
import photosFromServer from '../api/photos';
import { getAlbumById } from './getAlbumById';
import { FullPhoto } from '../types/Photo';

export const getPreparedPhotos = (): FullPhoto[] => {
  return photosFromServer.map(photo => ({
    ...photo,
    album: getAlbumById(photo.albumId, getPreparedAlbumn()),
  }));
};
