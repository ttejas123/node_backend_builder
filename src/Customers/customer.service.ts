
    // import {customerRepository}  from './customer.repository';

    export class customerService {
      repository : any;
      constructor() {
        this.repository = {}
      }
    
      async create(data:any) {
        // Implement business logic
        return this.repository.create(data);
      }
    
      async read(id:any) {
        // Implement business logic
        return this.repository.read(id);
      }
    
      async update(id:any, data:any) {
        // Implement business logic
        return this.repository.update(id, data);
      }
    
      async delete(id:any) {
        // Implement business logic
        return this.repository.delete(id);
      }
    }
    
  