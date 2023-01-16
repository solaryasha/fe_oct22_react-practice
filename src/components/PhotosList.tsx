import { FC, memo } from 'react';
import cn from 'classnames';

import { FullPhoto } from '../types/Photo';
import { getShortString } from '../helpers/getShortString';

type Props = {
  photos: FullPhoto[],
};

export const PhotosList: FC<Props> = memo(({ photos }) => {
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
        {photos.map(({ id, title, album }) => (
          <tr key={id}>
            <td className="has-text-weight-bold">
              {id}
            </td>

            <td>{title}</td>
            <td>
              {album?.title && getShortString(album?.title, 21)}
            </td>

            <td
              className={cn({
                'has-text-link': album?.user?.sex === 'm',
                'has-text-danger': album?.user?.sex === 'f',
              })}
            >
              {album?.user?.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
