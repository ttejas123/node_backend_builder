  //package.json
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

  module.exports = generatePackageJSONTemplate;