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

module.exports = tsConfigTemplate