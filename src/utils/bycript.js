import bcrypt from 'bcrypt';

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (passwordToVerify, storeddHash) => bcrypt.compareSync(passwordToVerify, storeddHash);

export { createHash, isValidPassword }