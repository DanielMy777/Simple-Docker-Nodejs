const validateVersion = (version: string) => {
    const parts = version.split('.');
    return parts.length === 3 && parts.every((el) => /^\d+$/.test(el));
};

export default validateVersion;
