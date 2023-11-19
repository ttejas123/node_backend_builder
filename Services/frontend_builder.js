const fs = require('fs');
const path = require('path')
const base_forlder = "/../dist/Result-frontend"

// Replace this with your table data
const generateReactComponent = (tableName, fields, ComponentName) => {
  const fieldElements = fields.map(field => {
    const fieldName = field.name;
    const fieldType = field.modelType;

    return (
      `<div key="${fieldName}">
        <label>${fieldName}:</label>
        <input
          type="${fieldType}"
          name="${fieldName}"
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        />
      </div>`
    );
  }).join('\n');

  return `
import { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Import the modal library

const ${ComponentName}Form = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/${tableName}', { data: [formData] });
      console.log(response.data);
      onRequestClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="${ComponentName} Form"
    >
      <div>
        <h2>${ComponentName} Form</h2>
        <form onSubmit={handleSubmit}>
          ${fieldElements}
          <button type="submit">Submit</button>
        </form>
      </div>
    </Modal>
  );
};

export default ${ComponentName}Form;
  `;
  };

  const generateDataTableComponent = (tableName, fields, ComponentName) => {
    const columns = fields.map(field => ({
      name: field.name,
      selector: field.name,
      sortable: true,
    }));
  
    return `
      import { useEffect, useState } from 'react';
      import DataTable from 'react-data-table-component';
      import axios from 'axios';
      import ${ComponentName}Form from './${ComponentName}Form';
  
      const ${ComponentName}DataTable = () => {
        const [data, setData] = useState([]);
        const [isModalOpen, setIsModalOpen] = useState(false);

        const openModal = () => setIsModalOpen(true);
        const closeModal = () => setIsModalOpen(false);
  
        useEffect(() => {
          fetchData();
        }, []);
  
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3000/${tableName}');
            setData(response.data.data);
          } catch (error) {
            console.error('Error:', error);
          }
        };
  
        return (
          <div>
            <h2>${tableName} DataTable</h2>
            <button onClick={openModal}>Add ${ComponentName}</button>
            <DataTable
              columns={${JSON.stringify(columns, null, 2)}}
              data={data}
              pagination
              highlightOnHover
            />
            <${ComponentName}Form isOpen={isModalOpen} onRequestClose={closeModal} />
          </div>
        );
      };
  
      export default ${ComponentName}DataTable;
    `;
  };
  
  const generateReactMainApp = (tableData) => {
    const imports = tableData.map(({ table_name }) => {
        return (`
// import ${table_name}Form from './component/${table_name}/${table_name}Form';
import ${table_name}DataTable from './component/${table_name}/${table_name}DataTable';
        `)
    }).join('\n');
    const components = tableData.map(({ table_name }) => {
        return (`
// <${table_name}Form key="${table_name}_form" />
<${table_name}DataTable key="${table_name}_datatable" />
`)
    }).join('\n');
  
    return `
import React from 'react';
${imports}

const App = () => {
return (
    <div>
    <h1>Dynamic Form App</h1>
    ${components}
    </div>
);
};

export default App;
    `;
  };
  
  const generateReactEntryFile = () => {
    return `
      import React from 'react';
      import ReactDOM from 'react-dom';
      import App from './App';
  
      ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        document.getElementById('root')
      );
    `;
  };

  const generateVitaConfigTemplate = () => {
    return (
        `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
        `
    )
  }

  const generatePackageJSONTemplate = () => {
    return (
        `
        {
            "name": "dynamic_frontend_test_project",
            "private": true,
            "version": "0.0.0",
            "type": "module",
            "scripts": {
              "dev": "vite",
              "build": "vite build",
              "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
              "preview": "vite preview"
            },
            "dependencies": {
              "axios": "^1.6.2",
              "react": "^18.2.0",
              "react-data-table-component": "^7.5.4",
              "react-dom": "^18.2.0"
            },
            "devDependencies": {
              "@types/react": "^18.2.37",
              "@types/react-dom": "^18.2.15",
              "@vitejs/plugin-react": "^4.2.0",
              "eslint": "^8.53.0",
              "eslint-plugin-react": "^7.33.2",
              "eslint-plugin-react-hooks": "^4.6.0",
              "eslint-plugin-react-refresh": "^0.4.4",
              "vite": "^5.0.0",
              "react-modal": "^3.16.1"
            }
          }
          
        `
    )
  }

  const generateIndexHTML = () => {
    return (
        `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
        `
    )
  }

  const generateESLINTRCCJS = () => {
    return (`
    module.exports = {
        root: true,
        env: { browser: true, es2020: true },
        extends: [
          'eslint:recommended',
          'plugin:react/recommended',
          'plugin:react/jsx-runtime',
          'plugin:react-hooks/recommended',
        ],
        ignorePatterns: ['dist', '.eslintrc.cjs'],
        parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
        settings: { react: { version: '18.2' } },
        plugins: ['react-refresh'],
        rules: {
          'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
          ],
        },
      }
    `)
  }

  const generateGITIGNORE = () => {
    return (`
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

    `)
  }
  
const init = (tableData) => {
    const folderPathReact = path.join(__dirname, base_forlder);
    if (!fs.existsSync(folderPathReact)) {
      fs.mkdirSync(folderPathReact);
    }

    const srcfolderPathReact = path.join(folderPathReact, 'src')
    const publicfolderPathReact = path.join(folderPathReact, 'public')
    const componentfolderPathReact = path.join(srcfolderPathReact, 'component')

    if (!fs.existsSync(srcfolderPathReact)) {
        fs.mkdirSync(srcfolderPathReact);
    }

    if (!fs.existsSync(publicfolderPathReact)) {
        fs.mkdirSync(publicfolderPathReact);
    }

    if (!fs.existsSync(componentfolderPathReact)) {
        fs.mkdirSync(componentfolderPathReact);
    }

    tableData.forEach(({ name, fields, table_name }) => {
        const component_folder = path.join(componentfolderPathReact, table_name)
        if (!fs.existsSync(component_folder)) {
            fs.mkdirSync(component_folder);
        }
      fs.writeFileSync(path.join(component_folder, `${table_name}DataTable.jsx`), generateDataTableComponent(name, fields, table_name));
      fs.writeFileSync(path.join(component_folder, `${table_name}Form.jsx`), generateReactComponent(name, fields, table_name));
    });

    fs.writeFileSync(path.join(srcfolderPathReact, 'App.jsx'), generateReactMainApp(tableData));
    fs.writeFileSync(path.join(srcfolderPathReact, 'main.jsx'), generateReactEntryFile());

    fs.writeFileSync(path.join(folderPathReact, 'vite.config.js'), generateVitaConfigTemplate());
    fs.writeFileSync(path.join(folderPathReact, 'package.json'), generatePackageJSONTemplate());
    fs.writeFileSync(path.join(folderPathReact, 'index.html'), generateIndexHTML());
    fs.writeFileSync(path.join(folderPathReact, '.gitignore'), generateGITIGNORE());
    fs.writeFileSync(path.join(folderPathReact, '.eslintrc.cjs'), generateESLINTRCCJS());
};

module.exports = init
  