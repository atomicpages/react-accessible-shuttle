const config = {
    gatsby: {
        pathPrefix: '/',
        siteUrl: 'https://learn.hasura.io',
        gaTrackingId: null,
    },
    header: {
        logo: 'https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/favicon.png',
        logoLink: 'https://github.com/atomicpages/react-accessible-shuttle',
        title: 'React Accessible Shuttle',
        githubUrl: 'https://github.com/atomicpages/react-accessible-shuttle',
        helpUrl: '',
        tweetText: '',
        links: [{ text: '', link: '' }],
        search: {
            enabled: false,
            indexName: '',
            algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
            algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
            algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
        },
    },
    sidebar: {
        forcedNavOrder: ['/', '/basic-concepts', '/components', '/reducers', '/hooks'],
        links: [],
        frontline: false,
        ignoreIndex: false,
    },
    siteMetadata: {
        title: 'React Accessible Shuttle',
        description:
            'A tiny, zero dependency, shuttle (a.k.a list shuttle, dual listbox, etc.) implementation in React using hooks.',
        ogImage: null,
        docsLocation:
            'https://github.com/atomicpages/react-accessible-shuttle/tree/master/docs/content',
        favicon: 'https://graphql-engine-cdn.hasura.io/img/hasura_icon_black.svg',
    },
};

module.exports = config;
