const fs = require('fs');
const path = require('path')
const archiver = require('archiver');
const BaseFolder = "/../dist/Result-backend"

// Define a template for each component
const serviceTemplate = (tableName) => {
  
    return `
    import{ ${tableName}Repository } from './${tableName}.repository'

    export class ${tableName}Service {
      repository:any;
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
      
      async readAll() {
        // Implement business logic
        return await this.repository.readAll();
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
    
    //module.exports = ${tableName}Service;
  `;
  };

const controllerTemplate = (tableName) => `
import { ${tableName}Service } from './${tableName}.service'
import { Router } from 'express'
const router = Router();
import { generateApiResponse, authentication } from '../helper/Helper';

export class ${tableName}Controller {
  service: any;
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

const repositoryTemplate = (tableName, fields) => {
  const fieldNames = fields.map((field) => field.name);
  return `
import { Pool } from 'pg';
import { ${tableName} } from './${tableName}.model'
export class ${tableName}Repository {
  db: any;
  constructor() {
    this.db = new Pool({
      user: process.env.user,
      host: process.env.host,
      database: process.env.database,
      password: process.env.password,
      port: parseInt(process.env.port),
    });
  }

  async create(data:${tableName}[]): Promise<${tableName} | undefined> {
    const columns = Object.keys(data[0]);

    const query = \`
        INSERT INTO ${tableName} ($\{columns.join(', ')})
        VALUES
        $\{data.map(item => \`($\{columns.map(col => typeof item[col] === 'string' ? \`'$\{item[col]}'\` : item[col]).join(', ')})\`).join(', ')}
        RETURNING *;
    \`;
    // const query = \`INSERT INTO ${tableName} (${fieldNames.join(', ')}) VALUES (\${data.join(', ')}) RETURNING *\`;
    const response = await this.db.query(query, []);
    return response
  }

  async read(id:any): Promise<${tableName}[] | any[]> {
    const query = \`SELECT * FROM ${tableName} WHERE id = \${id}\`;
    const response = await this.db.query(query, []);
    return response
  }

  async readAll(): Promise<${tableName}[] | any[]> {
    const query = \`SELECT * FROM ${tableName}\`;
    const response = await this.db.query(query, []);
    return response
  }

  async exists(id:any): Promise<boolean> {
    const query = \`SELECT * FROM ${tableName} WHERE id = \${id}\`;
    const response = await this.db.query(query, []);
    return response.length > 0 ? true : false;
  }

  async update(id:any, data:any): Promise<${tableName} | undefined> {
    const query = \`UPDATE ${tableName} SET \${this.db.as.values(data)} WHERE id = \${id} RETURNING *\`;
    const response = await this.db.query(query, []);
    return response
  }

  async delete(id:any): Promise<${tableName} | undefined> {
    const query = \`DELETE FROM ${tableName} WHERE id = \${id} RETURNING *\`;
    const response = await this.db.query(query, []);
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

const packageJSONTemplate = () => {
  return `
  {
    "name": "Backend-builder",
    "version": "1.0.0",
    "description": "",
    "scripts": {
      "dev": "npx tsc && ts-node-dev --exit-child src/index.ts",
      "start": "ts-node src/index.ts"
    },
    "devDependencies": {
      "@types/body-parser": "^1.19.5",
      "@types/cors": "^2.8.16",
      "@types/express": "^4.17.1",
      "@types/node": "^20.8.10",
      "cors": "^2.8.5",
      "dotenv": "^16.3.1",
      "pg": "^8.11.3",
      "ts-node": "^10.9.1",
      "ts-node-dev": "^2.0.0",
      "typescript": "^5.2.2"
    },
    "dependencies": {
      "express": "^4.17.1"
    }
  }  
`;
};

const tsConfigTemplate = () => {
  return `
  {
    "compilerOptions": {
      "module": "commonjs",
      "esModuleInterop": true,
      "target": "es6",
      "moduleResolution": "node",
      "sourceMap": true,
      "outDir": "dist"
    },
    "lib": ["es2015"]
  } 
`;
};

const envTemplate = () => {
  return `
  user="postgres"
  host="localhost"
  database="test"
  password="Tejas@#123"
  port=5432
`;
};

const indexTemplate = (tableData) => {
  return (
    `
import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config'
import cors from 'cors'
${
  tableData.map(({ name, table_name }) => {
      return `import { ${name}Controller } from './${table_name}/${name}.controller'; \n`
  }).join("")
}
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors())

//Controllers Init
${
  tableData.map(({ name, fields, table_name }) => {
      return `const ${name}Controller_test = new ${name}Controller(); \n`
  }).join("")
}

//Routes
${
  tableData.map(({ name, fields, table_name }) => {
      return `
app.use('/${name}', ${name}Controller.getRouter());`
  }).join("")
}

app.get('/', (req, res) => {
  res.send('Api Documentation will go here');
});

app.listen(port, () => {
  return console.log(\`Express is listening at http://localhost:$\{port}\`);
});
    
    `
  )
}

const helperClassTemplate  = () => {
  return `
  export const inject = (dependency) => {
    return function (target, key) {
      target[key] = dependency;
    };
  };

  export const authentication = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        
        let msg: string;
        if(args[0]){
            msg = (\`$\{propertyKey}, that has a parameter value: $\{args[0]}\`)
        }
        else{
            msg = \`\${propertyKey}\`
        }
        console.log(\`Logger says - calling the method: $\{msg}\`);
        const result = originalMethod.apply(this, args);
        if(result){
            msg = \`$\{propertyKey} and returned: $\{JSON.stringify(result)}\`;
        }
        else{
            msg = \`$\{propertyKey}\`;
        }
        console.log(\`Logger says - called the method: $\{msg}\`);
        return result;
    };
     return descriptor;
};

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

const generateZipOfResult = (res) => {
  const resultFolderPath = path.join(__dirname, BaseFolder);
  const zipPath = path.join(__dirname, 'generated-code-backend.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');

    // Send the zip file path to the frontend
  });

  archive.on('error', (err) => {
    console.error('Error creating zip file:', err);
  });

  // Add the ``BaseFolder`` folder to the zip file
  archive.directory(resultFolderPath, BaseFolder);
  archive.pipe(output);
  archive.finalize();

  res.download(zipPath, 'generated-code-backend.zip', (err) => {
    if (err) {
      console.error('Error sending zip file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Optionally, you can remove the generated zip file after it's sent
      fs.unlink(zipPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting zip file:', unlinkErr);
        }
      });
    }
  });
}

const init = (tableData, res_download) => {
  const Main_Backend_starter = path.join(__dirname, BaseFolder)
  if (!fs.existsSync(Main_Backend_starter)) {
    fs.mkdirSync(Main_Backend_starter);
  }

  const folderPath_src = path.join(__dirname, BaseFolder+"/src")
  if (!fs.existsSync(folderPath_src)) {
    fs.mkdirSync(folderPath_src);
  }
  // Loop through table data and generate files for each
  tableData.forEach(({ name, fields, table_name }) => {
    const folderPath = path.join(__dirname, "/"+BaseFolder+"/src/"+table_name);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(path.join(folderPath, `${name}.service.ts`), serviceTemplate(name, fields));
    fs.writeFileSync(path.join(folderPath, `${name}.controller.ts`), controllerTemplate(name));
    fs.writeFileSync(path.join(folderPath, `${name}.repository.ts`), repositoryTemplate(name, fields));
    fs.writeFileSync(path.join(folderPath, `${name}.model.ts`), modelTemplate(name, fields));
  });

  const BasePath = path.join(__dirname, BaseFolder);

  if (!fs.existsSync(path.join(BasePath, '/src/helper'))) {
    fs.mkdirSync(path.join(BasePath, '/src/helper'));
    fs.writeFileSync(path.join(path.join(BasePath, '/src/helper'), `Helper.ts`), helperClassTemplate()); 
  }


  fs.writeFileSync(path.join(path.join(BasePath, '/src'), `index.ts`), indexTemplate(tableData)); 
  fs.writeFileSync(path.join(path.join(BasePath, ''), `tsconfig.json`), tsConfigTemplate()); 
  fs.writeFileSync(path.join(path.join(BasePath, ''), `package.json`), packageJSONTemplate());
  fs.writeFileSync(path.join(path.join(BasePath, ''), `.env`), envTemplate());

  // generateZipOfResult(res_download)
}

module.exports = init