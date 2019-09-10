import * as React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import prismTheme from 'prism-react-renderer/themes/vsDark';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Shuttle, useShuttleState } from '../../../../src/index.ts';

import '../styles.css';

import Pre from './pre';

const diffStyle = {
    userSelect: 'none',
    MozUserSelect: '-moz-none',
    WebkitUserSelect: 'none',
};

const styles = { fontFamily: '"SF Mono", "Roboto Mono", Menlo, monospace' };

/** Removes the last token from a code example if it's empty. */
function cleanTokens(tokens) {
    const tokensLength = tokens.length;
    if (tokensLength === 0) {
        return tokens;
    }

    const lastToken = tokens[tokensLength - 1];

    if (lastToken.length === 1 && lastToken[0].empty) {
        return tokens.slice(0, tokensLength - 1);
    }

    return tokens;
}

const CodeBlock = ({ children: exampleCode, ...props }) => {
    if (props['react-live']) {
        return (
            <LiveProvider code={exampleCode} scope={{ Shuttle, useShuttleState }} theme={prismTheme}>
                <LiveEditor style={styles} />
                <LiveError />
                <LivePreview />
            </LiveProvider>
        );
    }

    return (
        <Highlight {...defaultProps} code={exampleCode} language="javascript" theme={prismTheme}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <Pre className={className} style={style} p={3}>
                    {cleanTokens(tokens).map((line, i) => {
                        let lineClass = {};
                        let isDiff = false;

                        if (line[0] && line[0].content.length && line[0].content[0] === '+') {
                            lineClass = { backgroundColor: 'rgba(76, 175, 80, 0.2)' };
                            isDiff = true;
                        } else if (
                            line[0] &&
                            line[0].content.length &&
                            line[0].content[0] === '-'
                        ) {
                            lineClass = { backgroundColor: 'rgba(244, 67, 54, 0.2)' };
                            isDiff = true;
                        } else if (
                            line[0] &&
                            line[0].content === '' &&
                            line[1] &&
                            line[1].content === '+'
                        ) {
                            lineClass = { backgroundColor: 'rgba(76, 175, 80, 0.2)' };
                            isDiff = true;
                        } else if (
                            line[0] &&
                            line[0].content === '' &&
                            line[1] &&
                            line[1].content === '-'
                        ) {
                            lineClass = { backgroundColor: 'rgba(244, 67, 54, 0.2)' };
                            isDiff = true;
                        }

                        const lineProps = getLineProps({ line, key: i });
                        lineProps.style = lineClass;

                        let splitToken;

                        return (
                            // eslint-disable-next-line react/jsx-key
                            <div {...lineProps}>
                                {line.map((token, key) => {
                                    if (isDiff) {
                                        if (
                                            (key === 0 || key === 1) &
                                            (token.content.charAt(0) === '+' ||
                                                token.content.charAt(0) === '-')
                                        ) {
                                            if (token.content.length > 1) {
                                                splitToken = {
                                                    types: ['template-string', 'string'],
                                                    content: token.content.slice(1),
                                                };

                                                const firstChar = {
                                                    types: ['operator'],
                                                    content: token.content.charAt(0),
                                                };

                                                return (
                                                    <React.Fragment key={key}>
                                                        <span
                                                            {...getTokenProps({
                                                                token: firstChar,
                                                                key,
                                                            })}
                                                            style={diffStyle}
                                                        />
                                                        <span
                                                            {...getTokenProps({
                                                                token: splitToken,
                                                                key,
                                                            })}
                                                        />
                                                    </React.Fragment>
                                                );
                                            } else {
                                                return (
                                                    <span
                                                        {...getTokenProps({ token, key })}
                                                        key={key}
                                                        style={diffStyle}
                                                    />
                                                );
                                            }
                                        }
                                    }

                                    return <span key={key} {...getTokenProps({ token, key })} />;
                                })}
                            </div>
                        );
                    })}
                </Pre>
            )}
        </Highlight>
    );
};

export default CodeBlock;
