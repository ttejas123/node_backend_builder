const fs = require('fs');
const path = require('path')
const archiver = require('archiver');
const generateDataTableComponent = require('./CRUD_helper_components/Datatable');
const generateReactComponent = require('./CRUD_helper_components/AddForm');
const generateReactMainApp = require('./Utils_modules/Main');
const generateReactEntryFile = require('./Utils_modules/Entry');
const generateSideBarMenue = require('./CRUD_helper_components/Sidebar');
const generateFormScss = require('./CRUD_helper_components/FormSCSS');
const generateVitaConfigTemplate = require('./config_module/vitaConfig');
const generatePackageJSONTemplate = require('./config_module/packageJSON');
const generateIndexHTML = require('./Utils_modules/indexHTML');
const generateGITIGNORE = require('./config_module/gitignore');
const generateESLINTRCCJS = require('./config_module/eslinter');
const base_forlder = "/../dist/Result-frontend"


  const generateZipOfResult = (res) => {
    const resultFolderPath = path.join(__dirname, base_forlder);
    const zipPath = path.join(__dirname, 'generated-code-frontend.zip');
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
    archive.directory(resultFolderPath, base_forlder);
    archive.pipe(output);
    archive.finalize();
  }

function generateNestedJSON(dataArray, __dirname) {
    const result = {};

    dataArray.forEach((item) => {
      // console.log(item.path.replace(__dirname.replace("\\Services\\", ""), ""));
      const pathComponents = item.path.replace(__dirname.replace("\\Services", "")+'\\', "").split('\\');
      let current = result;
  
      // Iterate through path components and build the nested structure
      pathComponents.forEach((component, index) => {
        if (index === pathComponents.length - 1) {
          // Last component, set the generator_module
          current[component] = item.genarator_module;
        } else {
          // Create nested structure if it doesn't exist
          current[component] = current[component] || {};
          current = current[component];
        }
      });
    });
  
    return result;
}
  
const init = (tableData, res_download, __dirname) => {
    const preview_arr = []
    const folderPathReact = path.join(__dirname, base_forlder);
    if (!fs.existsSync(folderPathReact)) {
      fs.mkdirSync(folderPathReact);
    }

    const srcfolderPathReact = path.join(folderPathReact, 'src')
    const publicfolderPathReact = path.join(folderPathReact, 'public')
    const componentfolderPathReact = path.join(srcfolderPathReact, 'component')
    const baseComponentfolderPathReact = path.join(componentfolderPathReact, 'baseComponent')
    const assetsfolderPathReact = path.join(srcfolderPathReact, 'assets')

    if (!fs.existsSync(srcfolderPathReact)) {
        fs.mkdirSync(srcfolderPathReact);
    }

    if (!fs.existsSync(publicfolderPathReact)) {
        fs.mkdirSync(publicfolderPathReact);
    }

    if (!fs.existsSync(componentfolderPathReact)) {
        fs.mkdirSync(componentfolderPathReact);
    }
    
    if (!fs.existsSync(baseComponentfolderPathReact)) {
        fs.mkdirSync(baseComponentfolderPathReact);
    }
    
    if (!fs.existsSync(assetsfolderPathReact)) {
        fs.mkdirSync(assetsfolderPathReact);
    }

    tableData.forEach(({ name, fields, table_name }) => {
        const component_folder = path.join(componentfolderPathReact, table_name)
        if (!fs.existsSync(component_folder)) {
            fs.mkdirSync(component_folder);
        }
      fs.writeFileSync(path.join(component_folder, `${table_name}DataTable.jsx`), generateDataTableComponent(name, fields, table_name));
      fs.writeFileSync(path.join(component_folder, `${table_name}Form.jsx`), generateReactComponent(name, fields, table_name));

      preview_arr.push({
        path: path.join(component_folder, `${table_name}DataTable.jsx`),
        genarator_module: generateDataTableComponent(name, fields, table_name),
      })
      preview_arr.push({
        path: path.join(component_folder, `${table_name}Form.jsx`),
        genarator_module: generateReactComponent(name, fields, table_name),
      })
    });

    fs.writeFileSync(path.join(srcfolderPathReact, 'App.jsx'), generateReactMainApp(tableData));
    fs.writeFileSync(path.join(srcfolderPathReact, 'main.jsx'), generateReactEntryFile());
    fs.writeFileSync(path.join(baseComponentfolderPathReact, 'Sidebar.jsx'), generateSideBarMenue());
    fs.writeFileSync(path.join(assetsfolderPathReact, 'FormStyles.scss'), generateFormScss());
    fs.writeFileSync(path.join(folderPathReact, 'vite.config.js'), generateVitaConfigTemplate());
    fs.writeFileSync(path.join(folderPathReact, 'package.json'), generatePackageJSONTemplate());
    fs.writeFileSync(path.join(folderPathReact, 'index.html'), generateIndexHTML());
    fs.writeFileSync(path.join(folderPathReact, '.gitignore'), generateGITIGNORE());
    fs.writeFileSync(path.join(folderPathReact, '.eslintrc.cjs'), generateESLINTRCCJS());
    preview_arr.push(...[{
        path: path.join(srcfolderPathReact, 'App.jsx'),
        genarator_module: generateReactMainApp(tableData),
      }, {
        path: path.join(srcfolderPathReact, 'main.jsx'),
        genarator_module: generateReactEntryFile(),
      }, { 
        path: path.join(baseComponentfolderPathReact, 'Sidebar.jsx'),
        genarator_module: generateSideBarMenue(),
      },
      { 
        path: path.join(assetsfolderPathReact, 'FormStyles.scss'),
        genarator_module: generateFormScss(),
      },
      { 
        path: path.join(folderPathReact, 'vite.config.js'),
        genarator_module: generateVitaConfigTemplate(),
      }, { 
        path: path.join(folderPathReact, 'package.json'),
        genarator_module: generatePackageJSONTemplate(),
      }, { 
        path: path.join(folderPathReact, 'index.html'),
        genarator_module: generateIndexHTML(),
      },
      { 
        path: path.join(folderPathReact, '.gitignore'),
        genarator_module: generateGITIGNORE(),
      },
      { 
        path: path.join(folderPathReact, '.eslintrc.cjs'),
        genarator_module: generateESLINTRCCJS(),
      }])

    const resultJSON = generateNestedJSON(preview_arr, __dirname);
    fs.writeFileSync(path.join(__dirname, "JSON.json"), JSON.stringify(resultJSON, null, 2))
    // generateZipOfResult(res_download)
};

module.exports = init
  