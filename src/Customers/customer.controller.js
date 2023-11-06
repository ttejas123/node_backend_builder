
const customerService = require('./customer.service');
const express = require('express');
const router = express.Router();
const { generateApiResponse } = require('../helper/Helper');

class customerController {
  constructor() {
    this.service = new customerService();

    // Define the routes and mappings within the constructor
    router.post('/', this.create.bind(this));
    router.get('/:id', this.read.bind(this));
    router.put('/:id', this.update.bind(this));
    router.delete('/:id', this.delete.bind(this));
  }

  // Create API
  async create(req, res) {
    try {
      const data = req.body; // Assuming the request contains data to create
      const result = await this.service.create(data);
      generateApiResponse(res, 'Create customer', 'Item created successfully', result);
    } catch (error) {
      generateApiResponse(res, 'Create customer', 'Failed to create the item', null, 500);
    }
  }

  // Read API
  async read(req, res) {
    try {
      const id = req.params.id; // Assuming the ID is in the request parameters
      const result = await this.service.read(id);
      if (result) {
        generateApiResponse(res, 'Read customer', 'Item fetched successfully', result);
      } else {
        generateApiResponse(res, 'Read customer', 'Item not found', null, 404);
      }
    } catch (error) {
      generateApiResponse(res, 'Read customer', 'Failed to fetch the item', null, 500);
    }
  }

  // Update API
  async update(req, res) {
    try {
      const id = req.params.id; // Assuming the ID is in the request parameters
      const data = req.body; // Assuming the request contains data to update
      const result = await this.service.update(id, data);
      if (result) {
        generateApiResponse(res, 'Update customer', 'Item updated successfully', result);
      } else {
        generateApiResponse(res, 'Update customer', 'Item not found', null, 404);
      }
    } catch (error) {
      generateApiResponse(res, 'Update customer', 'Failed to update the item', null, 500);
    }
  }

  // Delete API
  async delete(req, res) {
    try {
      const id = req.params.id; // Assuming the ID is in the request parameters
      const result = await this.service.delete(id);
      if (result) {
        generateApiResponse(res, 'Delete customer', 'Item deleted successfully', result);
      } else {
        generateApiResponse(res, 'Delete customer', 'Item not found', null, 404);
      }
    } catch (error) {
      generateApiResponse(res, 'Delete customer', 'Failed to delete the item', null, 500);
    }
  }

  // Export the router for use in your Express application
  static getRouter() {
    return router;
  }
}

module.exports = customerController;

