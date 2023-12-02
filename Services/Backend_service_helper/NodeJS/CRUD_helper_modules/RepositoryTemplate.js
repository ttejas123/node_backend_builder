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

module.exports = repositoryTemplate