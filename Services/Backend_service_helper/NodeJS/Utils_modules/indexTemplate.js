const indexTemplate = (tableData) => {
    return (
      `
  import bodyParser from 'body-parser';
  import express from 'express';
  import 'dotenv/config'
  import cors from 'cors'
  ${
    tableData.map(({ name, table_name }) => {
        return `import { ${name}Controller } from './${table_name}/${name}.controller'; \n`
    }).join("")
  }
  const app = express();
  const port = 3000;
  
  app.use(bodyParser.json());
  app.use(cors())
  
  //Controllers Init
  ${
    tableData.map(({ name, fields, table_name }) => {
        return `const ${name}Controller_test = new ${name}Controller(); \n`
    }).join("")
  }
  
  //Routes
  ${
    tableData.map(({ name, fields, table_name }) => {
        return `
  app.use('/${name}', ${name}Controller.getRouter());`
    }).join("")
  }
  
  app.get('/', (req, res) => {
    res.send('Api Documentation will go here');
  });
  
  app.listen(port, () => {
    return console.log(\`Express is listening at http://localhost:$\{port}\`);
  });
      
      `
    )
  }


module.exports = indexTemplate