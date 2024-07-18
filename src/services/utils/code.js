export const generateCode = () => {
    return 'CODE-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};
