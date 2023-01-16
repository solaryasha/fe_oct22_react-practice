import { AlbumFull, PhotoFull } from '../types/types';
import albums from './albums';
import photos from './photos';
import users from './users';

const getPreparedAlbums = (): AlbumFull[] => {
  return albums.map(album => ({
    ...album,
    owner: users.find(user => user.id === album.userId),
  }));
};

export const getPreparedPhotos = (): PhotoFull[] => {
  const preparedPhotos = getPreparedAlbums();

  return photos.map(photo => {
    const album = preparedPhotos.find(item => item.id === photo.albumId);

    return {
      ...photo,
      album,
    };
  });
};
