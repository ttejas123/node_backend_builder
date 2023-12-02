  // Datatable
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

module.exports = generateDataTableComponent;