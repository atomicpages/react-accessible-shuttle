export const dummyState = ({
    source = 5,
    target = 5,
}: { source?: number; target?: number } = {}) => {
    let i = 0;
    let j = 0;

    return {
        source: new Array(source).fill(null).map(() => i++),
        target: new Array(target).fill(null).map(() => j++),
    };
};
