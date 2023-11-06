
  export const inject = (dependency) => {
    return function (target, key) {
      target[key] = dependency;
    };
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
  
  