const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../server');
const View = require('../models/View');

const { expect } = chai;
const request = supertest(app);

describe('View Routes', () => {
  afterEach(() => {
    sinon.restore();
  });


  describe('GET /', () => {
    it('should return a list of all views', async () => {
      const views = [
        { name: 'View 1', table: '1', appId: '1' },
        { name: 'View 2', table: '2', appId: '1' },
      ];

      sinon.stub(View, 'find').resolves(views);

      const res = await request.get('/views/');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(views);
    });

    // Add more test cases for error handling and edge cases
  });

  describe('GET /app/:appId', () => {
    it('should return a list of app-specific views', async () => {
      const appId = '1';
      const filteredViews = [
        { name: 'View 1', table: '1', appId: appId },
        { name: 'View 2', table: '2', appId: appId },
      ];

      sinon.stub(View, 'find').withArgs({ app: appId }).resolves(filteredViews);

      const res = await request.get(`/views/app/${appId}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(filteredViews);
    });

    // Add more test cases for error handling and edge cases
  });

  describe('GET /:id', () => {
    it('should return a view by its id', async () => {
      const id = '1';
      const view = { _id: id, name: 'View 1', table: '1', appId: '1' };

      sinon.stub(View, 'findById').withArgs(id).resolves(view);

      const res = await request.get(`/views/${id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(view);
    });

    // Add more test cases for error handling and edge cases
  });

});