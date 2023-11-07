const inject = (dependency) => {
    return function (target, key) {
      target[key] = dependency;
    };
  };

  function authentication(req, res) {
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

function generateApiResponse(res, apiName, description, data, code = 200) {
    const response = {
      name: apiName,
      description: description,
      data: data,
      code: code,
    };
  
    return res.status(code).json(response);
  }


module.exports = { 
  inject,
authentication,
generateApiResponse
 }
  