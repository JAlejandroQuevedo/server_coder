import { CustomRouter } from "../routesClass/custom.router.js"

export class TestRouter extends CustomRouter {
    init() {
        this.get('/', async (req, res) => {
            res.sendSuccess('Ok from x placement')
        })
    }
}