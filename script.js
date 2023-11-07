const fs = require('fs');
const path = require('path')

// Replace this with your table data
const tableData = [
  {
    name: 'v2_user',
    table_name: "Users",
    fields: [
      { name: 'id', type: 'integer', modelType: 'number' },
      { name: 'firstname', type: 'string', modelType: 'string' },
      { name: 'lastname', type: 'string', modelType: 'string'},
      { name: 'email', type: 'string', modelType: 'string'},
      { name: 'role', type: 'string', modelType: 'string'},
      { name: 'status', type: 'boolean', modelType: 'boolean'},
      { name: 'lastlogin', type: 'timestamp', modelType: 'string'},
      { name: 'onboarding_id', type: 'integer', modelType: 'number', join: 'onboarding_info'},
    ],
  },
  {
    name: 'onboarding_info',
    table_name: "Onboarding",
    fields: [
      { name: 'id', type: 'integer', modelType: 'number' },
      { name: 'client', type: 'string', modelType: 'string' },
      { name: 'script_url', type: 'string', modelType: 'string'},
      { name: 'web_account_id', type: 'string', modelType: 'string'},
      { name: 'web_id', type: 'string', modelType: 'string'},
      { name: 'validated', type: 'boolean', modelType: 'boolean'},
      { name: 'status', type: 'boolean', modelType: 'boolean'},
      { name: 'isdashboardready', type: 'boolean', modelType: 'boolean'}
    ],
  },
  {
    name: 'customer',
    table_name: "Customers",
    fields: [
      { name: 'customer_id', type: 'int', modelType: 'number' },
      { name: 'first_name', type: 'varchar(100)', modelType: 'string' },
      { name: 'last_name', type: 'varchar(100)', modelType: 'string' },
      { name: 'age', type: 'int', modelType: 'number' },
      { name: 'country', type: 'varchar(100)', modelType: 'string' },
    ],
  },
  {
    name: 'order',
    table_name: "Orders",
    fields: [
      { name: 'order_id', type: 'integer', modelType: 'number' },
      { name: 'item', type: 'varchar(100)', modelType: 'string' },
      { name: 'amount', type: 'integer', modelType: 'number' },
      { name: 'customer_id', type: 'integer', modelType: 'number' },
    ],
  },
];

// Define a template for each component
const serviceTemplate = (tableName, fields) => {
  
    return `
    const ${tableName}Repository = require('./${tableName}.repository');

    class ${tableName}Service {
      constructor() {
        this.repository = new ${tableName}Repository();
      }
    
      async create(data) {
        // Implement business logic
        return this.repository.create(data);
      }
    
      async read(id) {
        // Implement business logic
        return this.repository.read(id);
      }
    
      async update(id, data) {
        // Implement business logic
        return this.repository.update(id, data);
      }
    
      async delete(id) {
        // Implement business logic
        return this.repository.delete(id);
      }
    }
    
    module.exports = ${tableName}Service;
  `;
  };

const controllerTemplate = (tableName) => `
const ${tableName}Service = require('./${tableName}.service');
const express = require('express');
const router = express.Router();
const { generateApiResponse, authentication } = require('../helper/Helper');

class ${tableName}Controller {
  constructor() {
    this.service = new ${tableName}Service();

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

module.exports = ${tableName}Controller;

`;

const repositoryTemplate = (tableName, fields) => {
  const fieldNames = fields.map((field) => field.name);
  return `
import { Pool } from 'pg';
import { ${tableName} } from './${tableName}.model'
export class ${tableName}Repository {
  db: any;
  constructor() {
    this.db = new Pool(/* your database configuration */);
  }

  async create(data:any): Promise<${tableName} | undefined> {
    const query = \`INSERT INTO ${tableName} (${fieldNames.join(', ')}) VALUES (\${data.join(', ')}) RETURNING *\`;
    const response = await this.db.query(query, data);
    return response
  }

  async read(id:any): Promise<${tableName}[] | any[]> {
    const query = \`SELECT * FROM ${tableName} WHERE id = \${id}\`;
    const response = await this.db.query(query, [id]);
    return response
  }

  async exists(id:any): Promise<boolean> {
    const query = \`SELECT * FROM ${tableName} WHERE id = \${id}\`;
    const response = await this.db.query(query, [id]);
    return response.length > 0 ? true : false;
  }

  async update(id:any, data:any): Promise<${tableName} | undefined> {
    const query = \`UPDATE ${tableName} SET \${this.db.as.values(data)} WHERE id = \${id} RETURNING *\`;
    const response = await this.db.query(query, data);
    return response
  }

  async delete(id:any): Promise<${tableName} | undefined> {
    const query = \`DELETE FROM ${tableName} WHERE id = \${id} RETURNING *\`;
    const response = await this.db.query(query, [id]);
    return response
  }
}
`;
};

const modelTemplate = (tableName, fields) => {
  const modelFields = fields.map(field => `  ${field.name}?: ${field.modelType},`).join('\n');

  return `
  export interface ${tableName} {
  // Define your model schema here
  ${modelFields}
}
`;
};

const folderPath_src = path.join(__dirname, "src")
if (!fs.existsSync(folderPath_src)) {
  fs.mkdirSync(folderPath_src);
}
// Loop through table data and generate files for each
tableData.forEach(({ name, fields, table_name }) => {
  const folderPath = path.join(__dirname, "/src/"+table_name);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  fs.writeFileSync(path.join(folderPath, `${name}.service.js`), serviceTemplate(name, fields));
  fs.writeFileSync(path.join(folderPath, `${name}.controller.js`), controllerTemplate(name));
  fs.writeFileSync(path.join(folderPath, `${name}.repository.ts`), repositoryTemplate(name, fields));
  fs.writeFileSync(path.join(folderPath, `${name}.model.ts`), modelTemplate(name, fields));
});


const helperClassTemplate  = () => {
  return `
  export const inject = (dependency) => {
    return function (target, key) {
      target[key] = dependency;
    };
  };

  export function authentication(req, res) {
    return function (target, propertyKey, descriptor) {
      const originalMethod = descriptor.value;
  
      descriptor.value = async function (...args) {
        // Access request and response objects
        const request = args[0];
        const response = args[1];
  
        // You can use the request and response objects here
  
        return originalMethod.apply(this, args);
      };
  
      return descriptor;
    };
  }

  export function generateApiResponse(res, apiName, description, data, code = 200) {
    const response = {
      name: apiName,
      description: description,
      data: data,
      code: code,
    };
  
    return res.status(code).json(response);
  }
  `
}

const folderPath = path.join(__dirname, 'src/helper');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

fs.writeFileSync(path.join(folderPath, `Helper.js`), helperClassTemplate()); 