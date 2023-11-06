
import { Pool } from 'pg';
import { order } from './order.model'
export class orderRepository {
  db: any;
  constructor() {
    this.db = new Pool(/* your database configuration */);
  }

  async create(data:any): Promise<order | undefined> {
    const query = `INSERT INTO order (order_id, item, amount, customer_id) VALUES (${data.join(', ')}) RETURNING *`;
    const response = await this.db.query(query, data);
    return response
  }

  async read(id:any): Promise<order[] | any[]> {
    const query = `SELECT * FROM order WHERE id = ${id}`;
    const response = await this.db.query(query, [id]);
    return response
  }

  async exists(id:any): Promise<boolean> {
    const query = `SELECT * FROM order WHERE id = ${id}`;
    const response = await this.db.query(query, [id]);
    return response.length > 0 ? true : false;
  }

  async update(id:any, data:any): Promise<order | undefined> {
    const query = `UPDATE order SET ${this.db.as.values(data)} WHERE id = ${id} RETURNING *`;
    const response = await this.db.query(query, data);
    return response
  }

  async delete(id:any): Promise<order | undefined> {
    const query = `DELETE FROM order WHERE id = ${id} RETURNING *`;
    const response = await this.db.query(query, [id]);
    return response
  }
}
