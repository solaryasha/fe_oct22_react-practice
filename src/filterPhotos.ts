import { PhotoFull } from './types/types';

interface Filters {
  searchQuery: string,
  selectedAlbumsIds: number[],
  selectedUserId: number,
}

export const filterPhotos = (photos: PhotoFull[], filters: Filters) => {
  const {
    selectedUserId,
    selectedAlbumsIds,
    searchQuery,
  } = filters;

  const preparedSearchQuery = searchQuery.toLowerCase();

  return photos.filter((photo) => {
    const { title } = photo;
    const albumId = photo.album?.id || 0;
    const preparedName = title.toLowerCase();

    const isSearchQueryMatch = preparedName.includes(preparedSearchQuery);

    const isUserIdMatch = selectedUserId !== 0
      ? photo.album?.user?.id === selectedUserId
      : true;

    const isAlbumsMatch = selectedAlbumsIds.length
      ? selectedAlbumsIds.includes(albumId)
      : true;

    return isSearchQueryMatch && isUserIdMatch && isAlbumsMatch;
  });
};
