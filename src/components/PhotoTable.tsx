import { FC } from 'react';
import { PhotoFull } from '../types/types';

type PhotoTableProps = {
  photos: PhotoFull[];
};
export const PhotoTable: FC<PhotoTableProps> = ({ photos }) => {
  return (
    <div className="box table-container">
      <p data-cy="NoMatchingMessage">
        No photos matching selected criteria
      </p>

      <table
        className="table is-striped is-narrow is-fullwidth"
      >
        <thead>
          <tr>
            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                ID

                <a href="#/">
                  <span className="icon">
                    <i data-cy="SortIcon" className="fas fa-sort" />
                  </span>
                </a>
              </span>
            </th>

            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                Photo name

                <a href="#/">
                  <span className="icon">
                    <i className="fas fa-sort-down" />
                  </span>
                </a>
              </span>
            </th>

            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                Album name

                <a href="#/">
                  <span className="icon">
                    <i className="fas fa-sort-up" />
                  </span>
                </a>
              </span>
            </th>

            <th>
              <span className="is-flex is-flex-wrap-nowrap">
                User name

                <a href="#/">
                  <span className="icon">
                    <i className="fas fa-sort" />
                  </span>
                </a>
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {photos.map(photo => (
            <tr>
              <td className="has-text-weight-bold">
                {photo.id}
              </td>

              <td>{photo.title}</td>
              <td>{photo.album?.title}</td>

              <td className="has-text-link">
                {photo.owner?.name}
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
};
