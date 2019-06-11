# React Shuttle

A small shuttle (a.k.a list shuttle, dual listbox, etc.) implementation in React.

### Why?

Shuttles are, albeit, a rare pattern for most applications, but they have several valid use cases. Other implementation use concepts borrowed from the yonder days of jQuery or have a redux overhead. I wanted to build a shuttle that is ultra flexible and small.

### Features

-   Keyboard Navigation
    -   Select multiple using shift + up/down arrow
    -   Single select by using up/down
-   Mouse Navigation
    -   Single select by clicking
    -   Select ranges using Control/Command + Click
    -   Select complete ranges using Shift + Click
-   Shuttle items to and from using the right/left arrow
-   Complete rendering control
-   Reducer API

### Technical Details

React Shuttle works by using state reducing via `useReducer`. This allows us to have a redux-like API without the overhead. The process is broken down into two steps:

1. Give `react-shuttle` the data you want to render
2. Render your content

```jsx
const items = {
    source: [1, 2, 3],
    target: [4, 5, 6],
};

function App() {
    return (
        <Shuttle store={items}>
            <Shuttle.Container>
                {({ source }, selected, getItemProps) =>
                    source.map((item, index) => (
                        <Shuttle.Item
                            key={item}
                            value={item}
                            {...getItemProps(index)}>
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
                            key={item}
                            value={item}
                            {...getItemProps(index)}>
                            {item}
                        </Shuttle.Item>
                    ))
                }
            </Shuttle.Container>
        </Shuttle>
    );
}
```

This might seem strange at first, but having the rendering process be in your control allows for greater flexibility. This opens the door for many possibilities like: adding re-order controls to the right of the target container, adding an additional shuttle, adding drag-and-drop support, virtualizing large lists, etc.
