# React Shuttle Playground

Local development can be kind of a pain. This is meant to make contribution easier. If you find a bug and want to test your local changes you can do so by trying all changes ina sandbox environment with hot reloading.

> **Disclaimer** do _not_ attempt to use this webpack config for production builds of `react-shuttle`. This is for development and automation tests only.

## Setting Up
```bash
npm install # be sure to set up react-shuttle first

cd playground
npm install # or yarn
npm run start # or yarn start
```

The demo app will automatically launch your preferred browser. Be sure you're using an evergreen browser. I'm not including polyfills to ensure this works on IE 11 or pre-chromium Edge.

## Testing Changes
Open `index.tsx` under `playground/src` and start hacking away! `faker` has been added to random data generation so feel free to exploit that module for your dummy data needs.

> **Note:** Webpack will automatically build so please don't override imports in `index.tsx` unless it's required
