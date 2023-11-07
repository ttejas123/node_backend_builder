import express from 'express';
// require('../.babelrc');
import { customerController } from './Customers/customer.controller'

const app = express()

const customerController_d = new customerController()

app.use('/customer', customerController_d.getRouter());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});