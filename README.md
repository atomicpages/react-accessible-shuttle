React Shuttle
=============

A small shuttle (a.k.a list shuttle or dual listbox) implementation in React.

### Why?
Few implementations exist; most are written with jQuery. All of these implementations have severe issues scaling and all of them (including the single react component I found) require _you_ the supply a model that works with their render function. :shurg: maybe I'm biased, but, like, just let me render it myself... So here we are: `react-shuttle`.

### Props

### Usage

### Styling

### Customizing

### Virtualization
In practice, you might find there are performance with this [pattern](https://en.wikipedia.org/wiki/User_experience_design). We can't paginate a shuttle like we can with a table; however, we certainly can [virtualize our list](https://bvaughn.github.io/react-virtualized/#/components/List).
