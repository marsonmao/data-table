/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TablePagination from '../index';

describe('<TablePagination />', () => {
  it('Test invalid props combination', () => {
    const { rerender } = render(
      <TablePagination
        options={[5]}
        pageRows={5}
        itemMax={10}
        pageNow={0}
        requestChangePageRows={() => {}}
        requestGotoPage={() => {}}
      />
    );
    expect(screen.getByText('Max: 2', { exact: false }));

    const prs = [-Infinity, -100, -1, 0, Infinity, NaN];
    const ims = [-Infinity, -100, -1, 0, Infinity, NaN];
    for (let i = 0, iz = prs.length; i < iz; ++i) {
      for (let j = 0, jz = ims.length; j < jz; ++j) {
        rerender(
          <TablePagination
            options={[999]}  // doesnt matter, use other props to control
            pageRows={prs[i]}
            itemMax={ims[j]}
            pageNow={0}
            requestChangePageRows={() => {}}
            requestGotoPage={() => {}}
          />
        );
        expect(screen.getByText('Max: 1', { exact: false }));
        expect(screen.getByText('Displaying: 1-1, Total: 1'));
        expect(screen.getByText('>>')).toHaveAttribute('disabled');
        expect(screen.getByText('->')).toHaveAttribute('disabled');
        expect(screen.getByText('<-')).toHaveAttribute('disabled');
        expect(screen.getByText('<<')).toHaveAttribute('disabled');
      }
    }
  });
});
