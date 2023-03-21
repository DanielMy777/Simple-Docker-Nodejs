const isObject = (item: object): boolean => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

function deepMerge(item1: object, item2: object): object {
    for (const key in item2) {
        if (isObject(item2[key])) {
            if (!item1[key]) {
                Object.assign(item1, { [key]: {} });
            }
            deepMerge(item1[key], item2[key]);
        } else {
            Object.assign(item1, { [key]: item2[key] });
        }
    }
    return item1;
}

export default deepMerge;
