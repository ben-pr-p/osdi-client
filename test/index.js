const nock = require("nock");
const sampleAep = require("./sample-aep");
const samplePeople = require("./sample-people");
const samplePeople2 = require("./sample-people-2");
const expect = require("chai").expect;

const testBase = "https://osdi-sample-system.org/api/v1/";

const osdi = require("..");

const clientKeyList = [
  "motd",
  "vendorName",
  "productName",
  "osdiVersion",
  "maxPagesize",
  "namespace",
  "getPeople",
  "getPetitions",
  "getEvents",
  "getForms",
  "getFundraisingPages",
  "getDonations",
  "getTags",
  "getQueries",
  "getQuestions",
  "getSharePages",
  "getPersonSignupHelper",
  "getLists",
  "resources",
  "_links",
  "parse"
];

const responseKeyList = [
  "totalPages",
  "perPage",
  "totalRecords",
  "page",
  "_links",
  "people",
  "nextPage"
];

describe("constructor", () => {
  const scope = nock(testBase)
    .get("/")
    .reply(200, sampleAep);

  describe("if given an endpoint", () => {
    it("should throw an error if not a valid url", done => {
      osdi
        .client("bad url")
        .then(client => done(new Error(`did not invalidate bad url`)))
        .catch(err => {
          expect(err.message).to.equal("Not a valid URL");
          done();
        });
    });

    it("should throw an error if not https", done => {
      osdi
        .client("http://osdi-sample-system.org/api/v1/")
        .then(client => done(new Error("did not invalidate http")))
        .catch(err => {
          expect(err.message).to.equal("HTTPS required");
          done();
        });
    });

    it("should correctly parse the aep and initialize properties", done => {
      osdi
        .client(testBase)
        .then(client => {
          expect(client).to.have.all.keys(clientKeyList);
          done();
        })
        .catch(err => done(err));
    });
  });

  describe("if given json", () => {
    it("shoud correctly parse the aep and initialize properties", done => {
      osdi
        .client(sampleAep)
        .then(client => {
          expect(client).to.have.all.keys(clientKeyList);
          done();
        })
        .catch(err => done(err));
    });
  });
});

describe("getPeople", () => {
  const scope = nock(testBase)
    .get("/people")
    .reply(200, samplePeople);

  it("should hit the proper endpoint, returning json", done => {
    osdi
      .client(sampleAep)
      .then(client => {
        client
          .getPeople()
          .then(res => {
            expect(res).to.be.an("object");
            done();
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });
});

describe("client.parse", () => {
  let scope1;
  let scope2;
  let client;
  let res;

  before(done => {
    scope = nock(testBase)
      .get("/people")
      .reply(200, samplePeople);

    scope2 = nock(testBase)
      .get("/people?page=2")
      .reply(200, samplePeople2);

    osdi.client(sampleAep).then(cli => {
      client = cli;
      done();
    });
  });

  it("res should parse without error", done => {
    client
      .getPeople()
      .then(raw => {
        res = client.parse(raw);
        expect(res).to.have.all.keys(responseKeyList);
        done();
      })
      .catch(err => done(err));
  });

  it("res should have proper pagination methods", done => {
    expect(res.nextPage).to.be.a("function");
    expect(res.prevPage).to.be.undefined;

    res
      .nextPage()
      .then(raw => {
        const res2 = client.parse(raw);
        expect(res2.page).to.equal(2);
        expect(res2.prevPage).to.be.a("function");
        done();
      })
      .catch(err => done(err));
  });
});

const personKeys = ["data", "_links", "_updatedFields"];

describe("person resource", () => {
  let client;
  let people;
  let person;
  const newName = "jabis";

  before(done => {
    scope = nock(testBase)
      .get("/people")
      .reply(200, samplePeople);

    osdi.client(sampleAep).then(cli => {
      client = cli;

      client.getPeople().then(raw => {
        const res = client.parse(raw);
        people = res.people;
        done();
      });
    });
  });

  it("people should be an array of proper Person resources", done => {
    people.forEach(p => {
      expect(p).to.contain.all.keys(personKeys);
      expect(p.delete).to.be.a("function");
      expect(p.save).to.be.a("function");
      person = p;
    });

    done();
  });

  it("Person should have getters and setters", done => {
    expect(person.familyName()).to.be.a("string");
    person.familyName(newName);
    expect(person.familyName()).to.equal(newName);

    done();
  });

  it("setting and attr should add to updated fields", done => {
    expect(person._updatedFields).to.deep.equal(["familyName"]);
    done();
  });

  it("expect Person.save to be a put with the proper body", done => {
    const scope3 = nock(testBase)
      .put("/people/1efc3644-af25-4253-90b8-a0baf12dbd1e", {
        family_name: newName
      })
      .reply(200);

    person
      .save()
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(err => done(err));
  });

  it("should be able to create a new person", done => {
    const scope4 = nock(testBase)
      .post("/people", {
        familyName: "Jamie"
      })
      .reply(200);

    const p = new client.resources.Person({
      familyName: "Jamie"
    });

    p
      .save()
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(err => done(err));
  });

  it("should send a delete request on Person.delete", done => {
    const scope5 = nock(testBase)
      .delete("/people/1efc3644-af25-4253-90b8-a0baf12dbd1e")
      .reply(200);

    person
      .delete()
      .then(res => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch(err => done(err));
  });
});
