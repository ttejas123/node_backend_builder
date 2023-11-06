
import { Pool } from 'pg';
import { customer } from './customer.model'
export class customerRepository {
  db: any;
  constructor() {
    this.db = new Pool(/* your database configuration */);
  }

  async create(data:any): Promise<customer | undefined> {
    const query = `INSERT INTO customer (customer_id, first_name, last_name, age, country) VALUES (${data.join(', ')}) RETURNING *`;
    const response = await this.db.query(query, data);
    return response
  }

  async read(id:any): Promise<customer[] | any[]> {
    const query = `SELECT * FROM customer WHERE id = ${id}`;
    const response = await this.db.query(query, [id]);
    return response
  }

  async exists(id:any): Promise<boolean> {
    const query = `SELECT * FROM customer WHERE id = ${id}`;
    const response = await this.db.query(query, [id]);
    return response.length > 0 ? true : false;
  }

  async update(id:any, data:any): Promise<customer | undefined> {
    const query = `UPDATE customer SET ${this.db.as.values(data)} WHERE id = ${id} RETURNING *`;
    const response = await this.db.query(query, data);
    return response
  }

  async delete(id:any): Promise<customer | undefined> {
    const query = `DELETE FROM customer WHERE id = ${id} RETURNING *`;
    const response = await this.db.query(query, [id]);
    return response
  }
}
