const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../server');
const UserModel = require('../models/User');

const { expect } = chai;
const request = supertest(app);

describe('User Routes', () => {
  afterEach(() => {
    sinon.restore();
  });

 

  describe('GET /', () => {
    it('should return a list of all users', async () => {
      const users = [
        { email: 'user1@gmail.com' },
        { email: 'user2@gmail.com' },
      ];

      sinon.stub(UserModel, 'find').resolves(users);

      const res = await request.get('/users/');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(users);
    });

    // Add more test cases for error handling and edge cases
  });

  describe('GET /:email', () => {
    it('should return a user by its email', async () => {
      const email = 'user1@gmail.com';
      const user = { email: email };

      sinon.stub(UserModel, 'findOne').withArgs({ email: email }).resolves(user);

      const res = await request.get(`/users/${email}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(user);
    });

    // Add more test cases for error handling and edge cases
  });

  describe('PUT /:id', () => {
    it('should update a user by its id', async () => {
      const id = '1';
      const update = { email: 'updateduser@gmail.com' };

      sinon.stub(UserModel, 'findByIdAndUpdate').withArgs(id, update).resolves();

      const res = await request.put(`/users/${id}`).send(update);

      expect(res.status).to.equal(204);
    });

    // Add more test cases for error handling and edge cases
  });
});

