import { PrepearedAlbums, PrepearedPhotos } from '../types/types';
import albums from './albums';
import users from './users';
import photos from './photos';

const getPepearedAlbums = (): PrepearedAlbums[] => {
  return albums.map(album => ({
    ...album,
    owner: users.find(user => user.id === album.userId),
  }));
};

export const getPepearedPhotos = (): PrepearedPhotos[] => {
  const prepearedAlbums = getPepearedAlbums();

  return photos.map(photo => {
    const album = prepearedAlbums.find(a => a.id === photo.albumId);

    return {
      ...photo,
      album,
    };
  });
};
