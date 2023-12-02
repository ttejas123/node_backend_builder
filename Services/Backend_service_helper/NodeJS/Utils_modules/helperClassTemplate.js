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

    export interface base_service_interface {
      create(data: any): Promise<any>;
      read(id: string): Promise<any>;
      readAll(): Promise<any>;
      update(id: string, data: any): Promise<any>;
      delete(id: string): Promise<any>;
    }
    `
}

module.exports = helperClassTemplate
  
  