const path = require('path');
const Backend_builder = require('./Services/Backend_builder');
const generateCreateTableQueries = require('./Services/create_sql_table');
const frontend_builder = require('./Services/frontend_builder');
const fs = require('fs');

const response_folder = path.join(__dirname, 'dist')
if (!fs.existsSync(response_folder)) {
  fs.mkdirSync(response_folder);
}

// Replace this with your table data
const tableData = [
    {
      name: 'v2_user',
      table_name: "Users",
      fields: [
        { name: 'id', type: 'integer', modelType: 'number' },
        { name: 'firstname', type: 'string', modelType: 'string' },
        { name: 'lastname', type: 'string', modelType: 'string'},
        { name: 'email', type: 'string', modelType: 'string'},
        { name: 'role', type: 'string', modelType: 'string'},
        { name: 'status', type: 'boolean', modelType: 'boolean'},
        { name: 'lastlogin', type: 'timestamp', modelType: 'string'},
        { name: 'onboarding_id', type: 'integer', modelType: 'number', join: 'onboarding_info'},
      ],
    },
    {
      name: 'onboarding_info',
      table_name: "Onboarding",
      fields: [
        { name: 'id', type: 'integer', modelType: 'number' },
        { name: 'client', type: 'string', modelType: 'string' },
        { name: 'script_url', type: 'string', modelType: 'string'},
        { name: 'web_account_id', type: 'string', modelType: 'string'},
        { name: 'web_id', type: 'string', modelType: 'string'},
        { name: 'validated', type: 'boolean', modelType: 'boolean'},
        { name: 'status', type: 'boolean', modelType: 'boolean'},
        { name: 'isdashboardready', type: 'boolean', modelType: 'boolean'}
      ],
    },
    {
      name: 'customer',
      table_name: "Customers",
      fields: [
        { name: 'customer_id', type: 'int', modelType: 'number' },
        { name: 'first_name', type: 'varchar(100)', modelType: 'string' },
        { name: 'last_name', type: 'varchar(100)', modelType: 'string' },
        { name: 'age', type: 'int', modelType: 'number' },
        { name: 'country', type: 'varchar(100)', modelType: 'string' },
      ],
    },
    {
      name: 'order',
      table_name: "Orders",
      fields: [
        { name: 'order_id', type: 'integer', modelType: 'number' },
        { name: 'item', type: 'varchar(100)', modelType: 'string' },
        { name: 'amount', type: 'integer', modelType: 'number' },
        { name: 'customer_id', type: 'integer', modelType: 'number' },
      ],
    },
];

Backend_builder(tableData)
frontend_builder(tableData)

fs.writeFileSync(path.join(response_folder, `batch.sql`), generateCreateTableQueries(tableData));
//   step 1:- psql -d test -U postgres 
//   step 2:- \i C:/Users/Tejas/Documents/node/get_browser_log/dist/batch.sql; 
