import { Photo } from '../types/types';
import photos from './photos';
import albums from './albums';
import users from './users';

const findAlbumById = (albumId: number) => (
  albums.find(album => album.id === albumId)
);

const findOwnerById = (albumId: number) => {
  const findAlbum = findAlbumById(albumId);

  return users.find(user => user.id === findAlbum?.userId);
};

export const getPrepPhotos = (): Photo[] => (
  photos.map(photo => ({
    ...photo,
    album: findAlbumById(photo.albumId),
    owner: findOwnerById(photo.albumId),
  }))
);
