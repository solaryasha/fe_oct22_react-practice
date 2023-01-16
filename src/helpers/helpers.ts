import usersFromServer from '../api/users';
import photosFromServer from '../api/photos';
import albumsFromServer from '../api/albums';

import { FullPhoto } from '../types/FullPhoto';

export const getFullPhoto = (): FullPhoto[] => {
  return photosFromServer.map(photo => {
    const album = albumsFromServer.find(a => a.id === photo.albumId);
    const user = usersFromServer.find(u => u.id === album?.userId);

    return {
      ...photo,
      album,
      user,
    };
  });
};
