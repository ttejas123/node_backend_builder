const serviceTemplate = (tableName) => {
  
    return `
    import { ${tableName}Repository, ${tableName}_repository_interface } from './${tableName}.repository'
    import { base_service_interface } from '../helper/Helper'

    export class ${tableName}Service implements base_service_interface {
      repository:${tableName}_repository_interface;
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

module.exports = serviceTemplate