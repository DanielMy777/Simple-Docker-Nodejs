const validateChildIdExists = (child) => {
    return async function (id) {
        const doc = await child.findOne(id);
        return doc;
    };
};

export default validateChildIdExists;
