const request = require("supertest");
const app = require("../src/app");

describe("Contracts API", () => {
  it("should show all contracts", async () => {
    const res = await request(app).get("/contracts").set({
      profile_id: 8,
    });
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should show unauthorised when some hacker tries to access all contracts", async () => {
    const res = await request(app).get("/contracts").set({
      profile_id: 8888,
    });
    expect(res.statusCode).toEqual(401);
  });

  it("should show a single contract", async () => {
    const contractId = 3;
    const res = await request(app).get(`/contracts/${contractId}`).set({
      profile_id: 2,
    });

    expect(res.statusCode).toEqual(200);
    expect(typeof res.body).toBe("object");
  });

  it("should show unauthorised when any profile who is not part of contract tries to access it", async () => {
    const contractId = 2;
    const res = await request(app).get(`/contracts/${contractId}`).set({
      profile_id: 2,
    });
    expect(res.statusCode).toEqual(401);
  });
});
