const supertest = require('supertest');
const express = require('express');
const { commandSync } = require('execa');

const shopController = require('./shop');
const { Shop } = require('../models');

describe('controllers/shop', () => {
  const seed = '20200725050230-first-shop.js';
  let server;
  beforeAll(async () => {
    commandSync(`yarn sequelize db:seed --seed ${seed}`);
    server = express().use(await shopController());
  });
  afterAll(() => commandSync(`yarn sequelize db:seed:undo --seed ${seed}`));

  describe('GET /', () => {
    it('should get shop list', async () => {
      const pageIndex = 0;
      const pageSize = 10;
      const shopCount = await Shop.count({ offset: pageIndex * pageSize });

      const res = await supertest(server).get('/');
      expect(res.status).toBe(200);

      const { success, data } = res.body;
      expect(success).toBe(true);
      expect(data).toHaveLength(Math.min(shopCount, pageSize));
    });
  });

  describe('GET /:shopId', () => {
    it('should get shop info', async () => {
      const shop = await Shop.findOne();

      const res = await supertest(server).get(`/${shop.id}`);
      expect(res.status).toBe(200);

      const { success, data } = res.body;
      expect(success).toBe(true);
      expect(data.name).toBe(shop.name);
    });
  });

  describe('PUT /:shopId', () => {
    it('should update if proper shop info give', async () => {
      const shop = await Shop.findOne();
      const shopName = '美珍香';

      const res = await supertest(server).put(
        `/${shop.id}?name=${encodeURIComponent(shopName)}`
      );
      expect(res.status).toBe(200);

      const { success, data } = res.body;
      expect(success).toBe(true);
      expect(data.name).toBe(shopName);
    });

    it('should not update if shop info not valid', async () => {
      const shop = await Shop.findOne();
      const shopName = '';

      const res = await supertest(server).put(
        `/${shop.id}?name=${encodeURIComponent(shopName)}`
      );
      expect(res.status).toBe(400);

      const { success, data } = res.body;
      expect(success).toBe(false);
      expect(data).toBeFalsy();
    });
  });

  describe('POST /', () => {
    it('should create if proper shop info given', async () => {
      const oldShopCount = await Shop.count();

      const shopName = '美珍香';

      const res = await supertest(server).post('/').send(`name=${shopName}`);
      expect(res.status).toBe(200);

      const { success, data } = res.body;
      expect(success).toBe(true);
      expect(data.name).toBe(shopName);

      const newShopCount = await Shop.count();
      expect(newShopCount - oldShopCount).toBe(1);
    });

    it('should not create if shop info not valid', async () => {
      const shopName = '';

      const res = await supertest(server).post('/').send(`name=${shopName}`);
      expect(res.status).toBe(400);

      const { success, data } = res.body;
      expect(success).toBe(false);
      expect(data).toBeFalsy();
    });
  });

  describe('DELETE /:shopid', () => {
    it('should delete shop info', async () => {
      const oldShopCount = await Shop.count();
      const shop = await Shop.findOne();

      const res = await supertest(server).delete(`/${shop.id}`);
      expect(res.status).toBe(200);

      const { success } = res.body;
      expect(success).toBe(true);

      const newShopCount = await Shop.count();
      expect(newShopCount - oldShopCount).toBe(-1);
    });
  });
});
