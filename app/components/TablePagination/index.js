/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import './jss.css';
import * as ut from 'components/Table/util';

class TablePagination extends React.PureComponent {
  convertTo0IndexedAndRequest = (e) => { // expect input to be 1-indexed
    let value = Number(e.target.value);
    if (Number.isNaN(value)) value = 0;
    else --value;
    this.requestGotoPage(value)();
  }

  requestGotoPage = page => () => this.props.requestGotoPage(page);

  humanize = v => v+1;

  getSafeProps = () => {
    const {
      options,
      pageRows,
      pageNow,
      itemMax,
    } = this.props;
    const v = ut.validate;
    return {
      options: options.map(o => v(o, 1)),
      pageRows: v(pageRows, 1),
      pageNow: v(pageNow),
      itemMax: v(itemMax, 1),
    }
  }

  render() {
    const {
      className,
      requestChangePageRows,
    } = this.props;
    const {
      options,
      pageRows,
      pageNow,
      itemMax,
    } = this.getSafeProps();
    const select = (
      <select
        value={pageRows}
        onChange={requestChangePageRows}
      >
        {options.map(o => <option key={o.toString()} value={o}>{o}</option>)}
      </select>
    );
    const pageMax = ut.pageMax(itemMax, pageRows);
    const displayStart = (pageNow * pageRows);
    const displayEnd = Math.min((displayStart + pageRows), itemMax) - 1;
    const displayMax = itemMax - 1;
    const h = this.humanize;
    return (
      <div className={`paginationRoot ${className ? ` ${className}` : ''}`}>
        <div className="marginRight1">
          Rows per page {select}
        </div>
        <div className="marginRight1">
          {`Displaying: ${h(displayStart)}-${h(displayEnd)}, Total: ${h(displayMax)}`}
        </div>
        <div className="marginRight1">
          Page now
          <input className="paginationInput" value={h(pageNow)} onChange={this.convertTo0IndexedAndRequest} />
          {`Max: ${h(pageMax)}`}
        </div>
        <button type="button" disabled={pageNow === 0} onClick={this.requestGotoPage(0)}>{'<<'}</button>
        <button type="button" disabled={pageNow === 0} onClick={this.requestGotoPage(pageNow-1)}>{'<-'}</button>
        <button type="button" disabled={pageNow === pageMax} onClick={this.requestGotoPage(pageNow+1)}>{'->'}</button>
        <button type="button" disabled={pageNow === pageMax} onClick={this.requestGotoPage(pageMax)}>{'>>'}</button>
      </div>
    );
  }
}

TablePagination.propTypes = {
  className: PropTypes.string,
  options: PropTypes.arrayOf((options, i, componentName) => {
    const o = options[i];
    const ok = Number.isInteger(o) && (o > 0);
    if (!ok) {
      return new Error(`${componentName} error: options has invalid number = ${o}`);
    }
    return undefined;
  }).isRequired,
  pageRows: (props, _, componentName) => {
    const { pageRows } = props;
    const ok = Number.isInteger(pageRows) && (pageRows > 0);
    if (!ok) {
      return new Error(`${componentName} error: invalid pageRows = ${pageRows}`);
    }
    return undefined;
  },
  // 0-indexed, easier for developer
  pageNow: (props, _, componentName) => {
    const { pageNow } = props;
    const ok = Number.isInteger(pageNow) && (pageNow >= 0);
    if (!ok) {
      return new Error(`${componentName} error: invalid pageNow = ${pageNow}`);
    }
    return undefined;
  },
  // basically equals to rows.length
  itemMax: (props, _, componentName) => {
    const { itemMax } = props;
    const ok = Number.isInteger(itemMax) && (itemMax >= 0);
    if (!ok) {
      return new Error(`${componentName} error: invalid itemMax = ${itemMax}`);
    }
    return undefined;
  },
  requestChangePageRows: PropTypes.func.isRequired,
  requestGotoPage: PropTypes.func.isRequired, // 0-indexed, easier for developer
};

TablePagination.defaultProps = {
};

export default TablePagination;
