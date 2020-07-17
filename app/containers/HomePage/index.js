/* eslint-disable prettier/prettier */
import React from 'react';
import Table from 'components/Table';
import './jss.css';

/*
  This component serves as demo purpose, so data generation & style control are not using the most optimized way
 */
export default function HomePage() {
  const [themeClass, setThemeClass] = React.useState("tableLightTheme");
  const initialRows = React.useMemo(() => (
    []
  ), []);
  const fetchedRows = React.useMemo(() => (
    Array.from({ length: Math.floor(Math.random()*100) }, () => ({
      id: Math.random().toString(36).substr(2, 5),
      name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, Math.floor(Math.random()*10)+1),
      tags: Array.from({ length: Math.floor(Math.random()*10)+1 }, () => Math.random().toString(36).substr(2, 3)),
    }))
  ));
  const [rows, setRows] = React.useState(initialRows);
  const classes = React.useMemo(() => ({
    headerCell: "tableHeaderCell",
    dataCell: "tableDataCell",
    pagination: "tablePagination",
  }), []);
  const headerConfig = React.useMemo(() => ([{
    key: 'id',
    label: 'I.D.',
    sortable: true,
    size: `${8 * 12}px`,
  }, {
    key: 'name',
    label: 'Name',
    sortable: true,
    size: `${8 * 12}px`,
  }, {
    key: 'tags',
    label: 'TAGS',
    sortable: true,
    render: row => row.tags.join(', '),
    sort: (a, b) => a.tags.length - b.tags.length,
    align: 'right',
  }]), []);
  const paginationConfig = React.useMemo(() => ({
    options: [5, 10, 20],
  }), []);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 64,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', width: 800 }}>
        Choose color
        <button type="button" onClick={() => setThemeClass("tableLightTheme")}>Light (#F5F5F5)</button>
        <button type="button" onClick={() => setThemeClass("tableDarkTheme")}>Dark (#191919)</button>
      </div>
      <div style={{ display: 'flex', width: 800 }}>
        Fetch rows
        <button type="button" onClick={() => setRows(fetchedRows)}>Fetch</button>
      </div>
      <div style={{ width: 800, height: 640, overflow: 'auto' }}>
        <Table
          className={`tableRoot ${themeClass}`}
          classes={classes}
          headerConfig={headerConfig}
          rows={rows}
          paginationConfig={paginationConfig}
        />
      </div>
    </div>
  );
}
