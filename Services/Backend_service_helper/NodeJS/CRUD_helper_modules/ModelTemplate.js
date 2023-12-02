const modelTemplate = (tableName, fields) => {
    const modelFields = fields.map(field => `  ${field.name}?: ${field.modelType},`).join('\n');
  
    return `
    export interface ${tableName} {
    // Define your model schema here
    ${modelFields}
  }
  `;
};

module.exports = modelTemplate