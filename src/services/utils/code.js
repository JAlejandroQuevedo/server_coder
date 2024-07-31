export const generateCode = () => {
    return `CODE-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
};
