const { app } = require('../../server');
const request = require("supertest")

const mockReqAddDuty = {
    name:"Fake Duty", 
    priority:"Low", 
    deadline: new Date()
}

const mockReqUpdateDuty = {
    name:"Fake Duty update", 
    priority:"Medium", 
    deadline: new Date()
}

//Create Duty Test 
let dutyId = 
describe("POST /duties", () => {
    test("should create a duty", async () => {
        return request(app)
            .post("/duties")
            .send(mockReqAddDuty)
            .expect(201)
            .then(({ body })=>{
                dutyId = body.rows?.[0]?.id
            })
    });
});

const mockReqDeleteDuty = {
    ids: [dutyId]
}

describe("GET /duty", () => {
    it("should return all duties", async () => {
        return request(app)
            .get("/duties")
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            })
    });
});

describe("PATCH /duties/:id", () => {
    test("should update a duty", async () => {
        return request(app)
            .patch(`/duties/${dutyId}`)
            .send(mockReqUpdateDuty)
            .expect(200)
    });
});


describe("DELETE /api/product/delete/:id", () => {
    test("should delete a duty", async () => {
        return request(app)
            .delete(`/duties`)
            .send(mockReqDeleteDuty)
            .expect(200)
    });
});