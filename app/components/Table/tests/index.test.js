/* eslint-disable prettier/prettier */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Table from '../index';
import './test.css';

describe('<Table />', () => {
  it('Render 10 elements, with id and name both == index, test multiple behaviors', () => {
    const rows = Array.from({ length: 10 }, (v, i) => ({
      id: `id_${i.toString()}`,
      name: `name_${i.toString()}`,
      tags: Array.from({ length: Math.floor(Math.random()*10)+1 }, () => Math.random().toString(36).substr(2, 3)),
    }));
    const headerConfig = [{
      key: 'id',
      label: 'I.D.',
      sortable: true,
    }, {
      key: 'name',
      label: 'Name',
      sortable: true,
    }, {
      key: 'tags',
      label: 'TAGS',
      sortable: true,
      render: row => row.tags.join(', '),
      sort: (a, b) => a.tags.length - b.tags.length,
      align: 'right',
    }];
    const paginationConfig = {
      options: [5, 10, 20],
    };
    render(
      <Table
        className="tableDarkTheme"
        headerConfig={headerConfig}
        rows={rows}
        paginationConfig={paginationConfig}
      />
    );
    
    // test table root
    expect(screen.getByRole('table')).toHaveAttribute('class', 'tableDarkTheme');
    // how to check background color?

    // test pagination
    expect(screen.getByText('<<')).toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('1', { selector: 'input' }));
    expect(screen.getByText('Displaying: 1-5, Total: 10'));
    fireEvent.click(screen.getByText('>>'));
    expect(screen.getByText('>>')).toHaveAttribute('disabled');
    expect(screen.getByDisplayValue('2', { selector: 'input' }));
    expect(screen.getByText('Displaying: 6-10, Total: 10'));

    // test sorting
    expect(screen.getByText('id_5'));
    expect(screen.getByText('id_6'));
    expect(screen.getByText('id_7'));
    expect(screen.getByText('id_8'));
    expect(screen.getByText('id_9'));
    fireEvent.click(screen.getByText('🡱'));
    expect(screen.getByText('🡳'));
    expect(screen.getByText('id_4'));
    expect(screen.getByText('id_3'));
    expect(screen.getByText('id_2'));
    expect(screen.getByText('id_1'));
    expect(screen.getByText('id_0'));
    fireEvent.click(screen.getAllByText('?')[0]);
    expect(screen.getByText('🡱'));
    expect(screen.getByText('name_5'));
    expect(screen.getByText('name_6'));
    expect(screen.getByText('name_7'));
    expect(screen.getByText('name_8'));
    expect(screen.getByText('name_9'));

    // test change page rows
    fireEvent.change(screen.getByDisplayValue('5'), { target: { value: '10' } });
    expect(screen.getByText('name_0'));
    expect(screen.getByText('name_9'));
    expect(screen.getByText('Displaying: 1-10, Total: 10'));
    fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '5' } });

    // test pagination, user input
    expect(screen.getByText('Displaying: 1-5, Total: 10'));
    fireEvent.change(
      screen.getByDisplayValue('1'),
      { target: { value: '2' } },
    );
    expect(screen.getByDisplayValue('2'));
    expect(screen.getByText('Displaying: 6-10, Total: 10'));
  });

  it('Render 0 elements, no pagination, render 1 empty row', () => {
    const rows = [];
    const headerConfig = [{
      key: 'id',
      label: 'I.D.',
    }];
    render(
      <Table
        headerConfig={headerConfig}
        rows={rows}
      />
    );
    expect(screen.getByText('EMPTY'));
  });

  it('Render 8 elements, cover sorting of equal elements and EMPTY cell rendering', () => {
    const rows = Array.from({ length: 8 }, (v, i) => ({
      id: `id_${i.toString()}`,
      name: 'all same name',
    }));
    const headerConfig = [{
      key: 'name',
      label: 'Name',
      sortable: true,
    }];
    const paginationConfig = {
      options: [1, 10],
    };
    render(
      <Table
        headerConfig={headerConfig}
        rows={rows}
        paginationConfig={paginationConfig}
      />
    );
    expect(screen.getByText('all same name'));
    fireEvent.click(screen.getByText('🡱'));
    expect(screen.getByText('all same name'));
    
    fireEvent.click(screen.getByText('>>')); // remove multiple '1'...
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: '10' } });
    expect(screen.getAllByText('EMPTY').length === 2);
  });

  it('Render 10 elements, test user input of pagination', () => {
    const rows = Array.from({ length: 10 }, (v, i) => ({
      id: `id_${i.toString()}`,
      name: 'all same name',
    }));
    const headerConfig = [{
      key: 'name',
      label: 'Name',
      sortable: true,
    }];
    const paginationConfig = {
      options: [5, 10],
    };
    render(
      <Table
        headerConfig={headerConfig}
        rows={rows}
        paginationConfig={paginationConfig}
      />
    );
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: '-1' } });
    expect(screen.getByDisplayValue('1'));
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: '0' } });
    expect(screen.getByDisplayValue('1'));
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: 'AAA' } });
    expect(screen.getByDisplayValue('1'));
    fireEvent.change(screen.getByDisplayValue('1'), { target: { value: '3' } });
    expect(screen.getByDisplayValue('2'));
    fireEvent.change(screen.getByDisplayValue('2'), { target: { value: '300' } });
    expect(screen.getByDisplayValue('2'));
    fireEvent.change(screen.getByDisplayValue('2'), { target: { value: 'AAA' } });
    expect(screen.getByDisplayValue('1'));
  });

  it('Render 10 elements, test className and classes', () => {  
    const classes = {
      headerCell: "tableHeaderCell",
      dataCell: "tableDataCell",
      pagination: "tablePagination",
    };
    const rows = Array.from({ length: 10 }, (v, i) => ({
      id: `id_${i.toString()}`,
      name: 'all same name',
    }));
    const headerConfig = [{
      key: 'id',
      label: 'I.D.',
      sortable: true,
    }, {
      key: 'name',
      label: 'Name',
      sortable: true,
    }];
    const paginationConfig = {
      options: [5, 10],
    };
    render(
      <Table
        className="tableRoot tableDarkTheme"
        classes={classes}
        headerConfig={headerConfig}
        rows={rows}
        paginationConfig={paginationConfig}
      />
    );
    expect(screen.getByText('I.D.')).toHaveAttribute('class', 'headerCell cellTextAlign-left tableHeaderCell');
    expect(screen.getByText('id_0')).toHaveAttribute('class', 'dataCell cellTextAlign-left tableDataCell');
    // how to get pagination
  });
});
