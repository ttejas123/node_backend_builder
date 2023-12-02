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

module.exports = generateReactComponent;