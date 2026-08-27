const request = require("supertest");
const app = require("../server");

describe("Backend API Tests", () => {

    test("GET / should return API running message", async () => {

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);

        expect(response.text).toBe("DevOps Practice API is running");

    });

});