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


module.exports = packageJSONTemplate;