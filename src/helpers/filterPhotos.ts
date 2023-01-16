import { PhotoFull } from '../types/types';

interface Filters {
  query: string;
  selectedUserId: number;
  selectedAlbumId: number;
}

export const filterPhotos = (photos: PhotoFull[], filters: Filters) => {
  const {
    query,
    selectedUserId,
    selectedAlbumId,
  } = filters;

  const preparedQuery = query.toLowerCase();

  return photos.filter((photo) => {
    const { title } = photo;
    const preparedTitle = title.toLowerCase();

    const isQueryMatching = preparedTitle.includes(preparedQuery);

    const isUserIdMatching = selectedUserId !== 0
      ? photo.album?.user?.id === selectedUserId
      : true;

    const isAlbumMatching = selectedAlbumId !== 0
      ? photo.album?.id === selectedAlbumId
      : true;

    return isQueryMatching && isUserIdMatching && isAlbumMatching;
  });
};
