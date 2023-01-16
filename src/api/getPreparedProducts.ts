import { AlbumFull } from '../types/types';
import albums from './albums';
import photos from './photos';
import users from './users';

export const getPreparedPhotos = (): AlbumFull[] => {
  return photos.map(product => {
    const album = albums.find(al => al.id === product.albumId);
    const owner = users.find(u => u.id === album?.userId);

    return {
      ...product,
      album,
      owner,
    };
  });
};
