import React from 'react';
import { storiesOf } from '@storybook/react';

import faker from 'faker';
import kebabCase from 'lodash.kebabcase';

import { Shuttle } from '../src/index';
import '../styles/shuttle.scss';

const items = {
    source: new Array(14).fill(null).map(() => faker.internet.userName()),
    target: new Array(5).fill(null).map(() => faker.internet.userName()),
};

storiesOf('Shuttle', module).add('basic shuttle', () => (
    <Shuttle store={items}>
        <Shuttle.Container>
            {({ source }, selected, getItemProps) =>
                source.map((item, index) => (
                    <Shuttle.Item
                        key={kebabCase(item)}
                        value={kebabCase(item)}
                        {...getItemProps(index)}
                        selected={selected.source.selected.has(index)}>
                        {item}
                    </Shuttle.Item>
                ))
            }
        </Shuttle.Container>
        <Shuttle.Controls />
        <Shuttle.Container>
            {({ target }, selected, getItemProps) =>
                target.map((item, index) => (
                    <Shuttle.Item
                        key={kebabCase(item)}
                        value={kebabCase(item)}
                        {...getItemProps(index)}
                        selected={selected.target.selected.has(index)}>
                        {item}
                    </Shuttle.Item>
                ))
            }
        </Shuttle.Container>
    </Shuttle>
));
