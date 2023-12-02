const controllerTemplate = (tableName) => `
import { ${tableName}Service } from './${tableName}.service'
import { Router } from 'express'
const router = Router();
import { generateApiResponse, base_service_interface } from '../helper/Helper';

export class ${tableName}Controller {
  service: base_service_interface;
  constructor() {
    this.service = new ${tableName}Service();

    // Define the routes and mappings within the constructor
    router.post('/', this.create.bind(this));
    router.get('/', this.readAll.bind(this));
    router.get('/:id', this.read.bind(this));
    router.put('/:id', this.update.bind(this));
    router.delete('/:id', this.delete.bind(this));
  }

  // Create API
  
  async create(req, res) {
    try {
      const data = req.body.data; // Assuming the request contains data to create
      const result = await this.service.create(data);
      generateApiResponse(res, 'Create ${tableName}', 'Item created successfully', result);
    } catch (error) {
      generateApiResponse(res, 'Create ${tableName}', 'Failed to create the item', null, 500);
    }
  }

  // Read API
  
  async read(req, res) {
    try {
      const id = req.params.id; // Assuming the ID is in the request parameters
      const result = await this.service.read(id);
      if (result) {
        generateApiResponse(res, 'Read ${tableName}', 'Item fetched successfully', result);
      } else {
        generateApiResponse(res, 'Read ${tableName}', 'Item not found', null, 404);
      }
    } catch (error) {
      generateApiResponse(res, 'Read ${tableName}', 'Failed to fetch the item', null, 500);
    }
  }

  // Read All API
  
  async readAll(req, res) {
    try {
      const result = await this.service.readAll();
      if (result) {
        generateApiResponse(res, 'Read ${tableName}', 'Item fetched successfully', result.rows);
      } else {
        generateApiResponse(res, 'Read ${tableName}', 'Item not found', null, 404);
      }
    } catch (error) {
      generateApiResponse(res, 'Read ${tableName}', 'Failed to fetch the item', null, 500);
    }
  }

  // Update API
  
  async update(req, res) {
    try {
      const id = req.params.id; // Assuming the ID is in the request parameters
      const data = req.body; // Assuming the request contains data to update
      const result = await this.service.update(id, data);
      if (result) {
        generateApiResponse(res, 'Update ${tableName}', 'Item updated successfully', result);
      } else {
        generateApiResponse(res, 'Update ${tableName}', 'Item not found', null, 404);
      }
    } catch (error) {
      generateApiResponse(res, 'Update ${tableName}', 'Failed to update the item', null, 500);
    }
  }

  // Delete API
  
  async delete(req, res) {
    try {
      const id = req.params.id; // Assuming the ID is in the request parameters
      const result = await this.service.delete(id);
      if (result) {
        generateApiResponse(res, 'Delete ${tableName}', 'Item deleted successfully', result);
      } else {
        generateApiResponse(res, 'Delete ${tableName}', 'Item not found', null, 404);
      }
    } catch (error) {
      generateApiResponse(res, 'Delete ${tableName}', 'Failed to delete the item', null, 500);
    }
  }

  // Export the router for use in your Express application
  static getRouter() {
    return router;
  }
}

`;

module.exports = controllerTemplate