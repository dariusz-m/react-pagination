import React from 'react';
import PropTypes from 'prop-types';
import {
    map, inc, range, findIndex, divide, sort, remove,
} from 'ramda';

export const MAX_OF_VISIBLE_PAGES_NUMBERS = 3;


/**
 * Pure pagination component
 */
export class Pagination extends React.PureComponent {
    /**
     * Constructor
     * @param {Object} props: Props
     */
    constructor(props) {
        super(props);
        this.decrementPageNumber = this.decrementPageNumber.bind(this);
        this.incrementPageNumber = this.incrementPageNumber.bind(this);
    }

    /**
     * Decrement page number
     */
    decrementPageNumber() {
        this.props.onChange(this.props.currentPage - 1);
    }

    /**
     * Increment page number
     */
    incrementPageNumber() {
        this.props.onChange(this.props.currentPage + 1);
    }

    /**
     * Render decrement page number arrow when it is first page
     * @returns {null|JSXElement}
     */
    renderDecrementPageNumberArrow() {
        const isFirstPage = this.props.currentPage === 1;
        return isFirstPage
            ? null
            : <li id={'decrement-arrow'} onClick={this.decrementPageNumber}><a><span> &#171; </span></a></li>;
    }

    /**
     * Render increment page number arrow when it is last page
     * @returns {null|JSXElement}
     */
    renderIncrementPageNumberArrow() {
        const isLastPage = this.props.currentPage === getNumberOfAllAvailablePages(
            this.props.itemsCount,
            this.props.itemsPerPage,
        );
        return isLastPage
            ? null
            : <li id={'increment-arrow'} onClick={this.incrementPageNumber}><a><span> &#187; </span></a></li>;
    }

    /**
     * Render
     * @returns {JSXElement}
     */
    render() {
        const pages = preparePagesNumbers(
            MAX_OF_VISIBLE_PAGES_NUMBERS,
            this.props.itemsCount,
            this.props.itemsPerPage,
            this.props.currentPage,
        );

        return (
            <ul>
                {this.renderDecrementPageNumberArrow()}
                {pages.map(page => <PageNumber
                    key={page}
                    page={page}
                    currentPage={this.props.currentPage}
                    onClick={this.props.onChange}
                />)}
                {this.renderIncrementPageNumberArrow()}
            </ul>
        );
    }
}

Pagination.propTypes = {
    itemsCount: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};


/**
 * Page number component
 */
export class PageNumber extends React.PureComponent {
    /**
     * Constructor
     * @param {Object} props: Props
     */
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    /**
     * On click callback
     */
    onClick() {
        this.props.onClick(this.props.page);
    }

    /**
     * Render
     * @returns {JSXElement}
     */
    render() {
        return (
            <li
                key={this.props.page}
                className={this.props.page === this.props.currentPage ? 'active' : ''}
                onClick={this.onClick}
            >
                <a>{this.props.page}</a>
            </li>
        );
    }
}

PageNumber.propTypes = {
    page: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
};

/**
 * Ger number all of all available pages numbers.
 * @param {number} numberOfTotalItems: Number of total items
 * @param {number} itemsPerPage: Items per page
 * @returns {number}
 */
const getNumberOfAllAvailablePages = (numberOfTotalItems, itemsPerPage) => Math.ceil(
    divide(numberOfTotalItems, itemsPerPage),
);

/**
 * Sort pagination pages numbers
 * @param {Array} pages: Pages
 * @returns {Array}
 */
const sortPages = pages => sort((a, b) => a - b, pages);

/**
 * Prepare pagination pages numbers
 * @param {number} maxOfVisiblePagesNumbers: Max of visible pages numbers
 * @param {number} numberOfTotalItems: Number of total items
 * @param {number} itemsPerPage: Items per page
 * @param {number} currentPage: Current page
 * @returns {Array}
 */
export const preparePagesNumbers = (maxOfVisiblePagesNumbers, numberOfTotalItems, itemsPerPage, currentPage) => {
    const allOfPages = map(inc, range(0, getNumberOfAllAvailablePages(numberOfTotalItems, itemsPerPage)));
    const indexOfCurrentPage = findIndex(pageNumber => pageNumber === currentPage, allOfPages);
    const initVisiblePagesNumbers = [allOfPages[indexOfCurrentPage]];
    const nonSortedPages = getOnlyVisiblePages(
        maxOfVisiblePagesNumbers,
        currentPage,
        allOfPages,
        initVisiblePagesNumbers,
    );
    return sortPages(nonSortedPages);
};

/**
 * Get only visible pagination pages numbers
 * @param {number} maxOfVisiblePagesNumbers: Max of visible pages numbers
 * @param {number} currentPage: Current page
 * @param {number} pages: Pages
 * @param {number} visiblePagesNumbers: Actual visible pages numbers
 * @returns {Array}
 */
const getOnlyVisiblePages = (maxOfVisiblePagesNumbers, currentPage, pages, visiblePagesNumbers) => {
    if (visiblePagesNumbers.length === maxOfVisiblePagesNumbers || pages.length === 0) return visiblePagesNumbers;
    const indexOfCurrentPage = findIndex(pageNumber => pageNumber === currentPage, pages);

    let availablePages = remove(indexOfCurrentPage, 1, pages);
    if (pages[indexOfCurrentPage - 1]) {
        visiblePagesNumbers = [...visiblePagesNumbers, pages[indexOfCurrentPage - 1]];
        availablePages = remove(indexOfCurrentPage - 1, 1, pages);
        if (pages[indexOfCurrentPage + 1]) {
            visiblePagesNumbers = [...visiblePagesNumbers, pages[indexOfCurrentPage + 1]];
            availablePages = remove(indexOfCurrentPage + 1, 1, pages);
        }
    } else if (pages[indexOfCurrentPage + 1]) {
        visiblePagesNumbers = [...visiblePagesNumbers, pages[indexOfCurrentPage + 1]];
        availablePages = remove(indexOfCurrentPage + 1, 1, pages);
        if (pages[indexOfCurrentPage - 1]) {
            visiblePagesNumbers = [...visiblePagesNumbers, pages[indexOfCurrentPage - 1]];
            availablePages = remove(indexOfCurrentPage - 1, 1, pages);
        }
    }
    return getOnlyVisiblePages(maxOfVisiblePagesNumbers, currentPage, availablePages, visiblePagesNumbers);
};
