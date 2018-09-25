import * as React from 'react';
import * as renderer from 'react-test-renderer';
import each from 'jest-each';
import { mount } from 'enzyme';

import {
    MAX_OF_VISIBLE_PAGES_NUMBERS, PageNumber, Pagination, preparePagesNumbers,
} from './pagination';

describe('Tests pagination', () => {
    it('Render pagination component ', () => {
        const component = renderer.create(
            <Pagination onChange={jest.fn()} currentPage={2} itemsCount={5} itemsPerPage={2}/>,
        );

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('Increment pagination page number', () => {
        const onPaginationPageChange = jest.fn();
        const currentPage = 1;
        const component = mount(
            <Pagination onChange={onPaginationPageChange} currentPage={currentPage} itemsCount={5} itemsPerPage={2}/>,
        );

        component.find('#increment-arrow').simulate('click');

        expect(onPaginationPageChange).toHaveBeenCalledWith(currentPage + 1);
    });

    it('Decrement pagination page number', () => {
        const onPaginationPageChange = jest.fn();
        const currentPage = 2;
        const component = mount(
            <Pagination onChange={onPaginationPageChange} currentPage={currentPage} itemsCount={5} itemsPerPage={2}/>,
        );

        component.find('#decrement-arrow').simulate('click');

        expect(onPaginationPageChange).toHaveBeenCalledWith(currentPage - 1);
    });

    it('Callback responsible for changing page number has been called with selected page', () => {
        const onPaginationPageChange = jest.fn();
        const currentPage = 2;
        const selectedPage = 3;
        const component = mount(
            <Pagination onChange={onPaginationPageChange} currentPage={currentPage} itemsCount={5} itemsPerPage={2}/>,
        );

        component.find(PageNumber).at(selectedPage - 1).simulate('click');

        expect(onPaginationPageChange).toHaveBeenCalledWith(selectedPage);
    });
});


each`
    numberOfTotalItems | itemsPerPage | currentPage | expectedPages
    ${1}               | ${3}         | ${1}        | ${[1]}
    ${2}               | ${3}         | ${1}        | ${[1]}
    ${3}               | ${3}         | ${1}        | ${[1]}
    ${4}               | ${3}         | ${1}        | ${[1, 2]}
    ${5}               | ${3}         | ${1}        | ${[1, 2]}
    ${6}               | ${3}         | ${1}        | ${[1, 2]}
    ${6}               | ${3}         | ${2}        | ${[1, 2]}
    ${7}               | ${3}         | ${3}        | ${[1, 2, 3]}
    ${13}              | ${3}         | ${1}        | ${[1, 2, 3]}
    ${13}              | ${3}         | ${2}        | ${[1, 2, 3]}
    ${13}              | ${3}         | ${3}        | ${[2, 3, 4]}
    ${13}              | ${3}         | ${4}        | ${[3, 4, 5]}
    ${13}              | ${3}         | ${5}        | ${[3, 4, 5]}
`.test('Should calculate $expectedPages pages numbers by given $numberOfTotalItems items where'
    + ' page contains only $itemsPerPage items and the current page is $currentPage', ({
        numberOfTotalItems, itemsPerPage, currentPage, expectedPages,
    }) => {
        const pages = preparePagesNumbers(MAX_OF_VISIBLE_PAGES_NUMBERS, numberOfTotalItems, itemsPerPage, currentPage);

        expect(pages).toEqual(expectedPages);
    });
