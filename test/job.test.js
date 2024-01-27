const request = require("supertest");
const app = require("../src/app");

describe("Jobs API", () => {
  it("should show all unpaid jobs", async () => {
    const res = await request(app).get("/jobs/unpaid").set({
      profile_id: 6,
    });
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return unauthorised when some hacker tries to access all unpaid jobs", async () => {
    const res = await request(app).get("/jobs/unpaid").set({
      profile_id: 66666,
    });
    expect(res.statusCode).toEqual(401);
  });
});
