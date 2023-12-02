  // main app
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

module.exports = generateReactMainApp;