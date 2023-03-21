const flterByFields = (src: object, fields: string[]) => {
    let dst: object = {};
    fields.forEach((field) => {
        if (src.hasOwnProperty(field)) {
            dst[field] = src[field];
        }
    });
    return dst;
};

export { flterByFields };
