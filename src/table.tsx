import { FC } from 'react';
import { PhotoComponent } from './PhotoComponent';
import { PreparedPhoto } from './types/preparedPhotos';

interface Props {
  photos: PreparedPhoto[]
}

export const Table: FC<Props> = ({ photos }) => {
  return (
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
        {
          photos.map(photo => <PhotoComponent key={photo.id} photo={photo} />)
        }
      </tbody>
    </table>
  );
};
