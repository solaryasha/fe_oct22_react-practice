// import { fullPhotosAlbum } from './types';

// interface Filters {
//   searchQuery: string,
//   selectedAlbumsIds: number[],
//   selectedUserId: number,
// }

// export default filterPhotos = (photos: fullPhotosAlbum[], filters: Filters) => (
// {
//   const {
//     searchQuery,
//     selectedAlbumsIds,
//     selectedUserId,
//   } = filters;

//   const preparedSearchQuery = searchQuery.toLowerCase();

//   return photos.filter((photo) => {
//     const { title } = photo;
//     const albumId = photo.album?.id || 0;
//     const preparedTitle = title.toLowerCase();

//     const isSearchQueryMatch = preparedTitle.includes(preparedSearchQuery);

//     const isUserMatch = selectedUserId !== 0
//       ? photo.album?.userId === selectedUserId
//       : true;

//     const isAlbumsMatch = selectedAlbumsIds.length
//       ? selectedAlbumsIds.includes(albumId)
//       : true;

//     return isSearchQueryMatch && isUserMatch && isAlbumsMatch;
//   });
// };
