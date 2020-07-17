/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash/memoize';
import TablePagination from 'components/TablePagination';
import './jss.css';
import * as ut from './util';

class Table extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
    this.fullWidthColSpan = 65535;
    this.mem_renderDataCells = memoize(this.renderDataCells);
  }

  static getDerivedStateFromProps(props, prevState) {
    const { rows } = props;
    const { readOnlyRows } = prevState;
    if (rows === readOnlyRows) return null;

    return {
      ...prevState,
      ...Table.initSorting(props),
      ...Table.initPagination(props),
    }
  }

  static initSorting(props) {
    const {
      rows: inRows,
      headerConfig,
    } = props;
    const rows = [...inRows]; // copy this to prevent mutating read-only props
    const firstSortableKey = (headerConfig.find(c => c.sortable) || { key: undefined }).key;
    const sortFunctions = headerConfig.reduce((accu, c) => {
      if (c.sortable) {
        if (c.sort) accu[c.key] = c.sort;
        else accu[c.key] = (a, b) => ((a[c.key] < b[c.key]) ? -1 : (a[c.key] > b[c.key]) ? 1 : 0);
      } 
      return accu;
    }, {});
    if (firstSortableKey) {
      rows.sort(Table.sortFunction(firstSortableKey, 0, sortFunctions));
    }
    return {
      readOnlyRows: inRows,
      rows,
      sortingOrder: 0,
      sortingKey: firstSortableKey,
      sortFunctions,
    };
  }

  static initPagination(props) {
    const {
      rows,
      paginationConfig = {}
    } = props;
    const {
      options = [],
    } = paginationConfig;
    return {
      pageRows: ut.validate((options.length > 0 && options[0]) || rows.length, 1),
      pageNow: 0,
    };
  }

  static sortResults = [-1, 1];
  
  static sortSymbols = ['🡱', '🡳', '?'];

  static sortFunction(sortingKey, sortingOrder, sortFunctions) {
    return (a, b) => {
      const result = sortFunctions[sortingKey](a, b);
      if (result < 0) return Table.sortResults[sortingOrder];
      if (result > 0) return Table.sortResults[1 - sortingOrder];
      return 0;
    };
  }

  requestSort = (key) => () => {
    const {
      rows,
      sortingOrder: prevOrder,
      sortingKey: prevKey,
      sortFunctions,
    } = this.state;
    const order = (key === prevKey) ? (1 - prevOrder) : 0;
    this.setState({
      rows: rows.sort(Table.sortFunction(key, order, sortFunctions)),
      sortingOrder: order,
      sortingKey: key,
    });
  }

  requestChangePageRows = (e) => {
    this.setState({
      pageRows: ut.validate(Number(e.target.value), 1),
      pageNow: 0, // safer
    });
  }

  requestGotoPage = (page) => {
    const { rows, pageRows } = this.state;
    const pageMax = ut.pageMax(rows.length, pageRows);
    let value = ut.validate(page);
    value = Math.min(pageMax, value);
    value = Math.max(0, value);
    this.setState({
      pageNow: value,
    });
  }

  renderHeader = () => {
    const {
      classes,
      headerConfig,
    } = this.props;
    const {
      sortingOrder,
      sortingKey,
    } = this.state;
    return (
      <tr
        className={`headerRow${classes.headerRow ? ` ${classes.headerRow}` : ''}`}
      >
        {headerConfig.map(({
          key,
          align = 'left',
          className,
          size,
          sortable = false,
          label,
        }) => (
          <th
            key={key}
            className={`headerCell cellTextAlign-${align}${classes.headerCell ? ` ${classes.headerCell}` : ''}${className ? ` ${className}` : ''}`}
            style={(size && { width: size }) || undefined}
          >
            {sortable && (
              <button
                type="button"
                onClick={this.requestSort(key)}
              >
                {sortingKey === key ? Table.sortSymbols[sortingOrder] : Table.sortSymbols[2]}
              </button>
            )}
            {label || key}
          </th>
        ))}
      </tr>
    );
  }

  renderBody = () => {
    const {
      classes,
    } = this.props;
    const {
      rows,
      pageRows,
      pageNow,
    } = this.state;
    const trClassName = `dataRow${classes.dataRow ? ` ${classes.dataRow}` : ''}`;
    const elements = [];
    for (let st = (pageNow * pageRows), en = (st + pageRows), i = st; i < en; ++i) {
      const row = rows[i];
      const el = row
        ? (
          <tr
            key={row.id}
            className={trClassName}
          >
            {this.mem_renderDataCells(row)}
          </tr>
        )
        : (
          <tr
            key={`empty_row_${i}`}
            className={trClassName}
          >
            {this.renderEmptyCell()}
          </tr>
        );
      elements.push(el);
    }
    return elements;
  }

  renderDataCells = (row) => {
    const {
      classes,
      headerConfig,
    } = this.props;
    return headerConfig.map(({
      key,
      align = 'left',
      className,
      render,
    }) => (
      <td
        key={key}
        className={`dataCell cellTextAlign-${align}${classes.dataCell ? ` ${classes.dataCell}` : ''}${className ? ` ${className}` : ''}`}
      >
        {render ? render(row) : row[key]}
      </td>
    ));
  }

  renderEmptyCell = () => {
    const {
      classes,
    } = this.props;
    return (
      <td
        colSpan={this.fullWidthColSpan}
        className={`dataCell cellTextAlign-left${classes.dataCell ? ` ${classes.dataCell}` : ''}`}
      >
        EMPTY
      </td>
    );
  }

  renderPagination = () => {
    const {
      classes,
      paginationConfig,
    } = this.props;
    if (!paginationConfig) return null;

    const {
      rows,
      pageRows,
      pageNow,
    } = this.state;
    const {
      options,
      component: Pagination = TablePagination,
    } = paginationConfig;
    return (
      <tr>
        <td colSpan={this.fullWidthColSpan}>
          <Pagination
            className={classes.pagination}
            options={options}
            pageRows={pageRows}
            pageNow={pageNow}
            itemMax={rows.length}
            requestChangePageRows={this.requestChangePageRows}
            requestGotoPage={this.requestGotoPage}
          />
        </td>
      </tr>
    );
  }

  render() {
    const {
      className,
    } = this.props;
    return (
      <table className={className}>
        <thead>
          {this.renderHeader()}
        </thead>
        <tbody>
          {this.renderBody()}
        </tbody>
        <tfoot>
          {this.renderPagination()}
        </tfoot>
      </table>
    );
  }
}

Table.propTypes = {
  classes: PropTypes.shape({
    headerRow: PropTypes.string,
    headerCell: PropTypes.string,
    dataRow: PropTypes.string,
    dataCell: PropTypes.string,
    pagination: PropTypes.string,
  }),
  className: PropTypes.string,
  headerConfig: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool,
    sort: PropTypes.func, // standard sort function signature
    align: PropTypes.oneOf(['left', 'right', 'center']),
    render: PropTypes.func, // row => row.x.join(','), for example
    size: PropTypes.string, // '100px' or '40%', etc.
    className: PropTypes.string, // if you really want to customize
  })).isRequired,
  // eslint falsy check...this is used, is copied in constructor
  // eslint-disable-next-line react/no-unused-prop-types
  rows: PropTypes.arrayOf(PropTypes.shape({ // should check if each row has the property of headerConfig?
    id: PropTypes.string.isRequired,
  })),
  paginationConfig: PropTypes.shape({
    options: PropTypes.arrayOf(PropTypes.number).isRequired,
    component: PropTypes.elementType,
  }),
};

Table.defaultProps = {
  classes: {},
};

export default Table;
