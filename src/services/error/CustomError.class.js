export default class CustomError extends Error {
    constructor(type, message = '', payload = '') {
        super(message);
        this.type = type
        this.payload = payload
    }
}
