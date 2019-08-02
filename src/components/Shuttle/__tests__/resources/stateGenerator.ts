export const dummyState = () => {
    let i = 0;
    let j = 0;

    return {
        source: new Array(5).fill(null).map(() => i++),
        target: new Array(5).fill(null).map(() => j++),
    };
};
