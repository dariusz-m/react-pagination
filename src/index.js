import './style.less';

import React from 'react';
import ReactDOM from 'react-dom';

import { Pagination } from './pagination';


const ITEMS_PER_PAGE = 3;
const NUMBER_OF_ITEMS = 13;

/**
 * App
 */
class App extends React.Component {
    /**
     * Constructor
     */
    constructor() {
        super();
        this.state = { currentPage: 1 };
        this.onPaginationPageChange = this.onPaginationPageChange.bind(this);
    }

    /**
     * Pagination page chance callback
     * @param {number} selectedPage: Selected pagination page.
     */
    onPaginationPageChange(selectedPage) {
        this.setState(() => ({ currentPage: selectedPage }));
    }

    /**
     * Render
     * @returns {JSXElement}
     */
    render() {
        return (
            <Pagination
                onChange={this.onPaginationPageChange}
                itemsPerPage={ITEMS_PER_PAGE}
                itemsCount={NUMBER_OF_ITEMS}
                currentPage={this.state.currentPage}
            />
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('pagination'));
