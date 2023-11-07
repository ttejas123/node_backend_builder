
const onboarding_infoService = require('./onboarding_info.service');
const express = require('express');
const router = express.Router();
const { generateApiResponse, authentication } = require('../helper/Helper');

class onboarding_infoController {
  constructor() {
    this.service = new onboarding_infoService();

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
      generateApiResponse(res, 'Create onboarding_info', 'Item created successfully', result);
    } catch (error) {
      generateApiResponse(res, 'Create onboarding_info', 'Failed to create the item', null, 500);
    }
  }

  // Read API
  
  async read(req, res) {
    try {
      const id = req.params.id; // Assuming the ID is in the request parameters
      const result = await this.service.read(id);
      if (result) {
        generateApiResponse(res, 'Read onboarding_info', 'Item fetched successfully', result);
      } else {
        generateApiResponse(res, 'Read onboarding_info', 'Item not found', null, 404);
      }
    } catch (error) {
      generateApiResponse(res, 'Read onboarding_info', 'Failed to fetch the item', null, 500);
    }
  }

  // Update API
  
  async update(req, res) {
    try {
      const id = req.params.id; // Assuming the ID is in the request parameters
      const data = req.body; // Assuming the request contains data to update
      const result = await this.service.update(id, data);
      if (result) {
        generateApiResponse(res, 'Update onboarding_info', 'Item updated successfully', result);
      } else {
        generateApiResponse(res, 'Update onboarding_info', 'Item not found', null, 404);
      }
    } catch (error) {
      generateApiResponse(res, 'Update onboarding_info', 'Failed to update the item', null, 500);
    }
  }

  // Delete API
  
  async delete(req, res) {
    try {
      const id = req.params.id; // Assuming the ID is in the request parameters
      const result = await this.service.delete(id);
      if (result) {
        generateApiResponse(res, 'Delete onboarding_info', 'Item deleted successfully', result);
      } else {
        generateApiResponse(res, 'Delete onboarding_info', 'Item not found', null, 404);
      }
    } catch (error) {
      generateApiResponse(res, 'Delete onboarding_info', 'Failed to delete the item', null, 500);
    }
  }

  // Export the router for use in your Express application
  static getRouter() {
    return router;
  }
}

module.exports = onboarding_infoController;

