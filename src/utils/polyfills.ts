const __CLIENT__ = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

function matchPolyfill() {
    if (typeof Element.prototype.matches !== 'function') {
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
        Element.prototype.matches = Element.prototype.matches =
            // @ts-ignore
            Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
}

function closestPolyfill() {
    if (typeof Element.prototype.closest !== 'function') {
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
        Element.prototype.closest = function closest(selector: string) {
            let element: any = this;

            do {
                if (element.matches(selector)) {
                    return element;
                }

                element = element.parentElement || element.parentNode;
            } while (element !== null && element.nodeType === 1);

            return null;
        };
    }
}

export function polyfill() {
    if (__CLIENT__) {
        matchPolyfill();
        closestPolyfill();
    }
}
