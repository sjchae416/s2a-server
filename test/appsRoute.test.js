const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../server');
const AppModel = require('../models/App');
const UserModel = require('../models/User');

const { expect } = chai;
const request = supertest(app);

describe('App Routes', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /', () => {
    it('should create a new app and return it', async () => {
      const appData = {
        name: 'Test App 2',
        creator: 'Test Creator',
        roles: {
          admin: ['NameTest@gmail.com']
        },
        roleMembershipSheet: 'test-sheet',
        published: true
      };

      const createdApp = { ...appData, _id: '1' };

      sinon.stub(AppModel, 'create').resolves(createdApp);
      sinon.stub(UserModel, 'exists').resolves(false);
      sinon.stub(UserModel, 'create').resolves({ email: 'NameTest@gmail.com.com', apps: ['1'] });

      const res = await request.post('/apps/').send(appData);

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(createdApp);
    });

    // Add more test cases for error handling and edge cases
  });

  describe('GET /', () => {
    it('should return a list of all apps', async () => {
      const apps = [
        { _id: '1', name: 'App 1', creator: 'Creator 1' },
        { _id: '2', name: 'App 2', creator: 'Creator 2' },
      ];

      sinon.stub(AppModel, 'find').resolves(apps);


      const res = await request.get('/apps/');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(apps);
    });

    // Add more test cases for error handling and edge cases
  });

  describe('GET /:id', () => {
    it('should return an app by its id', async () => {
      const app = { _id: '1', name: 'App 1', creator: 'Creator 1' };

      sinon.stub(AppModel, 'findById').withArgs('1').resolves(app);


      const res = await request.get('/apps/1');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(app);
    });

    // Add more test cases for error handling and edge cases
  });

});
