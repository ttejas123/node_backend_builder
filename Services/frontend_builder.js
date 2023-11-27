const fs = require('fs');
const path = require('path')
const archiver = require('archiver');
const base_forlder = "/../dist/Result-frontend"

// Replace this with your table data
const generateReactComponent = (tableName, fields, ComponentName) => {
  const fieldElements = fields.map(field => {
    const fieldName = field.name;
    const fieldType = field.modelType;

    if(fieldName === 'id') return '';

    return (
      `<div key="${fieldName}">
        <label className="input">${fieldName}:</label>
        ${
          fieldType === 'boolean' ? (
            `
            <input 
            className='input__field'
            type="checkbox" 
            name="${fieldName}"
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.checked })}
            />
            `
          ) : (
            `<input
            className='input__field'
            type="${fieldType}"
            name="${fieldName}"
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />`
          )
        }
      </div>`
    );
  }).join('\n');

  return `
/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import '../../assets/FormStyles.scss'

const ${ComponentName}Form = ({ isOpen, onRequestClose, toggle, ...args }) => {
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

  const closeBtn = (
    <Button className="close" onClick={onRequestClose} type="button">
      &times;
    </Button>
  );

  return (

    <Modal className='card card--accent p-0'  isOpen={isOpen} toggle={onRequestClose} {...args}>
      <ModalHeader toggle={toggle} close={closeBtn}>Users Form</ModalHeader>
      <ModalBody className='w-100'>
        <form onSubmit={handleSubmit}>
          ${fieldElements}
          <Button className='mt-3 w-25 d-flex justify-content-center' type="submit">Submit</Button>
        </form>
      </ModalBody>
    </Modal>

      
  );
};

export default ${ComponentName}Form;
  `;
  };

  const generateDataTableComponent = (tableName, fields, ComponentName) => {
    const columns = fields.map(field => {
      if(field.type === 'boolean') {
        return (`{
          name: "${field.name}",
          selector: (row)=> {
            return (row["${field.name}"] ? <div>✅</div> : <div>❌</div>)
          },
          sortable: true,
        }`)
      }
      return (`{
        name: "${field.name}",
        selector: "${field.name}",
        sortable: true,
      }`)
    });
  
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
        const toggle = () => setIsModalOpen((pre)=> (!pre));
  
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
        
        const handleDelete = async (id) => {
          try {
            await axios.delete('http://localhost:3000/${tableName}/'+id);
            fetchData()
          } catch (error) {
            console.error('Error:', error);
          }
        };

        const handleEdit = async (id) => {
          try {
            toggle(id)
            // const response = await axios.delete('http://localhost:3000/${tableName}/'+id);
            fetchData()
          } catch (error) {
            console.error('Error:', error);
          }
        };
  
        return (
          <div>
            <h2>${ComponentName} DataTable</h2>
            <button type="reset" onClick={openModal}>+ Add ${ComponentName}</button>
            <DataTable
              columns={[
                ${columns},
                {
                    "name": "Edit",
                    "selector": (row) => {
                      return <div onClick={()=> handleEdit(row.id)}>✏️</div>;
                    }
                },
                {
                  "name": "Delete",
                  "selector": (row) => {
                    return <div onClick={()=> handleDelete(row.id)}>🗑️</div>;
                  }
                }
              ]}
              data={data}
              pagination
              highlightOnHover
            />
            <${ComponentName}Form isOpen={isModalOpen} onRequestClose={closeModal} toggle={toggle} />
          </div>
        );
      };
  
      export default ${ComponentName}DataTable;
    `;
  };
  
  const generateReactMainApp = (tableData) => {
    const imports = tableData.map(({ table_name }) => {
        return (`
import ${table_name}DataTable from './component/${table_name}/${table_name}DataTable';
        `)
    }).join('\n');
    const components = tableData.map(({ table_name }) => {
        return (`
<${table_name}DataTable key="${table_name}_datatable" />
`)
    }).join('\n');

    const sideBarItems = tableData.map(({table_name}) => {
      return `
      {
        title: "${table_name}",
        target: "/${`${table_name}`.toLowerCase()}",
        component: ${table_name}DataTable,
      },
      `
    }).join('\n')
  
    return `
${imports}
import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './component/baseComponent/Sidebar';

const App = () => {
  const sidebarIntesm = [
    ${sideBarItems}
  ]
return (
    <div>
    <SideBar sidebarItems={sidebarIntesm} />
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
              "react-modal": "^3.16.1",
              "sass": "^1.69.5",
              "bootstrap": "^5.3.2",      
              "react-data-table-component": "^7.5.4",
              "reactstrap": "^9.2.1"
            }
          }
          
        `
    )
  }

  const generateSideBarMenue = () => {
    return (
      `
      /* eslint-disable react/prop-types */
import { useState } from "react";
import { NavItem, NavLink, Nav } from "reactstrap";

const SideBar = ({ toggle, sidebarItems }) => {
  const [selectedItem, setSelectedItem] = useState(sidebarItems[0]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className={"row"} style={{height: "100vh"}}>
      <div className="sidebar-header col-2 my-auto" style={{borderRight: "1px solid #000"}}>
        <span color="info" onClick={toggle} style={{ color: "#fff" }}>
          &times;
        </span>
        <h3>Sidebar</h3>
        <div className="side-menu">
        <Nav vertical className="list-unstyled pb-3">
          {sidebarItems.map((item) => (
            <>
             
                <NavItem>
                  <NavLink
                    tag={'a'}
                    style={{cursor: "pointer"}}
                    to={item.target}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.title}
                  </NavLink>
                </NavItem>
            </>
          ))}
        </Nav>
      </div>
      </div>
      <div className="col-10">
      {selectedItem && <selectedItem.component />}
      </div>
    </div>
  );
};

export default SideBar;
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
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
            />
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

  const generateFormScss = () => {
    return (
      `
      @import url('https://rsms.me/inter/inter.css');

:root {
  --color-light: white;
  --color-dark: #212121;
  --color-signal: #fab700;
  
  --color-background: var(--color-light);
  --color-text: var(--color-dark);
  --color-accent: var(--color-signal);
  
  --size-bezel: .5rem;
  --size-radius: 4px;
  
  line-height: 1.4;
  
  font-family: 'Inter', sans-serif;
  font-size: calc(.6rem + .4vw);
  color: var(--color-text);
  background: var(--color-background);
  font-weight: 300;
  padding: 0 calc(var(--size-bezel) * 3);
}

h1, h2, h3 {
  font-weight: 900;
}

mark {
  background: var(--color-accent);
  color: var(--color-text);
  font-weight: bold;
  padding: 0 0.2em;
}

.card {
  background: var(--color-background);
  padding: calc(4 * var(--size-bezel));
  margin-top: calc(4 * var(--size-bezel));
  border-radius: var(--size-radius);
  border: 3px solid var(--color-shadow, currentColor);
  box-shadow: .5rem .5rem 0 var(--color-shadow, currentColor);
  
  &--inverted {
    --color-background: var(--color-dark);
    color: var(--color-light);
    --color-shadow: var(--color-accent);
  }
  
  &--accent {
    --color-background: var(--color-signal);
    --color-accent: var(--color-light);
    color: var(--color-dark);
  }
  
  *:first-child {
    margin-top: 0;
  }
}


.l-design-widht {
  max-width: 40rem;
  padding: 1rem;
}

.input {
  position: relative;
  
  &__label {
    position: absolute;
    left: 0;
    top: 0;
    padding: calc(var(--size-bezel) * 0.75) calc(var(--size-bezel) * .5);
    margin: calc(var(--size-bezel) * 0.75 + 3px) calc(var(--size-bezel) * .5);
    background: pink;
    white-space: nowrap;
    transform: translate(0, 0);
    transform-origin: 0 0;
    background: var(--color-background);
    transition: transform 120ms ease-in;
    font-weight: bold;
    line-height: 1.2;
  }
  &__field {
    box-sizing: border-box;
    display: block;
    width: 100%;
    border: 3px solid currentColor;
    padding: calc(var(--size-bezel) * 1.5) var(--size-bezel);
    color: currentColor;
    background: transparent;
    border-radius: var(--size-radius);
    
    &:focus,
    &:not(:placeholder-shown) {
      & + .input__label {
        transform: translate(.25rem, -65%) scale(.8);
        color: var(--color-accent);
      }
    }
  }
}


.button-group {
  margin-top: calc(var(--size-bezel) * 2.5);
}

button {
  color: currentColor;
  padding: var(--size-bezel) calc(var(--size-bezel) * 2);
  background: var(--color-accent);
  border: none;
  border-radius: var(--size-radius);
  font-weight: 900;
  
  &[type=reset]{
    background: var(--color-background);
    font-weight: 200;
  } 
}

button + button {
  margin-left: calc(var(--size-bezel) * 2);
}

.icon {
  display: inline-block;
  width: 1em; height: 1em;
  margin-right: .5em;
}

.hidden {
  display: none;
}
      `
    )
  }

  const generateZipOfResult = () => {
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
  
const init = (tableData) => {
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

    generateZipOfResult()
};

module.exports = init
  