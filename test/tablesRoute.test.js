const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const app = require('../server');
const TableModel = require('../models/Table');

const { expect } = chai;
const request = supertest(app);

describe('Table Routes', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /', () => {
    it('should create a new table and return it', async () => {
      const newTableData = {
        name: 'Test Table',
        url: 'https://example.com',
        sheetIndex: 0,
        keys: ['key1', 'key2'],
        columns: ['col1', 'col2'],
      };
      const newTable = { ...newTableData, _id: '1' };

      sinon.stub(TableModel, 'create').resolves(newTable);

      const res = await request.post('/tables/').send(newTableData);

      expect(res.status).to.equal(201);
      expect(res.body).to.deep.equal(newTable);
    });

    // Add more test cases for error handling and edge cases
  });

  describe('GET /', () => {
    it('should return a list of all tables', async () => {
      const tables = [
        { name: 'Table 1', url: 'https://example1.com', sheetIndex: 0, keys: ['key1', 'key2'], columns: ['col1', 'col2'], _id: '1' },
        { name: 'Table 2', url: 'https://example2.com', sheetIndex: 1, keys: ['key1', 'key2'], columns: ['col1', 'col2'], _id: '2' },
      ];

      sinon.stub(TableModel, 'find').resolves(tables);

      const res = await request.get('/tables/');

      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal(tables);
    });

    // Add more test cases for error handling and edge cases
  });

});