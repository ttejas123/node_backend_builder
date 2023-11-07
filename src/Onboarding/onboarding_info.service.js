
    const onboarding_infoRepository = require('./onboarding_info.repository');

    class onboarding_infoService {
      constructor() {
        this.repository = new onboarding_infoRepository();
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
    
    module.exports = onboarding_infoService;
  