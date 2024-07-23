import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
export const genarateFakeUsers = async (qty) => {
    const users = []
    for (let i = 0; i < qty; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });
        const password = await bcrypt.hash(faker.internet.password(), 10);

        users.push({ firstName, lastName, email, password })
    }

    return users
}
