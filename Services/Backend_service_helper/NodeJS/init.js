const fs = require('fs');
const path = require('path')
const archiver = require('archiver');
const serviceTemplate = require('./CRUD_helper_modules/ServiceTemplate');
const controllerTemplate = require('./CRUD_helper_modules/ControllerTemplate');
const repositoryTemplate = require('./CRUD_helper_modules/RepositoryTemplate');
const modelTemplate = require('./CRUD_helper_modules/ModelTemplate');
const tsConfigTemplate = require('./config_modules/tsConfigTemplate');
const packageJSONTemplatee = require('./config_modules/packageJSONTemplate');
const envTemplate = require('./config_modules/envTemplate');
const helperClassTemplate = require('./Utils_modules/helperClassTemplate');
const indexTemplate = require('./Utils_modules/indexTemplate');
const BaseFolder = "/../dist/Result-backend"
// Define a template for each component
const generateZipOfResult = (res) => {
  const resultFolderPath = path.join(__dirname, BaseFolder);
  const zipPath = path.join(__dirname, 'generated-code-backend.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');

    // Send the zip file path to the frontend
  });

  archive.on('error', (err) => {
    console.error('Error creating zip file:', err);
  });

  // Add the ``BaseFolder`` folder to the zip file
  archive.directory(resultFolderPath, BaseFolder);
  archive.pipe(output);
  archive.finalize();

  res.download(zipPath, 'generated-code-backend.zip', (err) => {
    if (err) {
      console.error('Error sending zip file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Optionally, you can remove the generated zip file after it's sent
      fs.unlink(zipPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting zip file:', unlinkErr);
        }
      });
    }
  });
}

const init = (tableData, res_download, __dirname) => {
  const Main_Backend_starter = path.join(__dirname, BaseFolder)
  if (!fs.existsSync(Main_Backend_starter)) {
    fs.mkdirSync(Main_Backend_starter);
  }

  const folderPath_src = path.join(__dirname, BaseFolder+"/src")
  if (!fs.existsSync(folderPath_src)) {
    fs.mkdirSync(folderPath_src);
  }
  // Loop through table data and generate files for each
  tableData.forEach(({ name, fields, table_name }) => {
    const folderPath = path.join(__dirname, "/"+BaseFolder+"/src/"+table_name);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    fs.writeFileSync(path.join(folderPath, `${name}.service.ts`), serviceTemplate(name, fields));
    fs.writeFileSync(path.join(folderPath, `${name}.controller.ts`), controllerTemplate(name));
    fs.writeFileSync(path.join(folderPath, `${name}.repository.ts`), repositoryTemplate(name, fields));
    fs.writeFileSync(path.join(folderPath, `${name}.model.ts`), modelTemplate(name, fields));
  });

  const BasePath = path.join(__dirname, BaseFolder);

  if (!fs.existsSync(path.join(BasePath, '/src/helper'))) {
    fs.mkdirSync(path.join(BasePath, '/src/helper'));
    fs.writeFileSync(path.join(path.join(BasePath, '/src/helper'), `Helper.ts`), helperClassTemplate()); 
  }


  fs.writeFileSync(path.join(path.join(BasePath, '/src'), `index.ts`), indexTemplate(tableData)); 
  fs.writeFileSync(path.join(path.join(BasePath, ''), `tsconfig.json`), tsConfigTemplate()); 
  fs.writeFileSync(path.join(path.join(BasePath, ''), `package.json`), packageJSONTemplatee());
  fs.writeFileSync(path.join(path.join(BasePath, ''), `.env`), envTemplate());

  // generateZipOfResult(res_download)
}

module.exports = init