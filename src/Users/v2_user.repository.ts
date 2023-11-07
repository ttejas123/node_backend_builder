
import { Pool } from 'pg';
import { v2_user } from './v2_user.model'
export class v2_userRepository {
  db: any;
  constructor() {
    this.db = new Pool(/* your database configuration */);
  }

  async create(data:any): Promise<v2_user | undefined> {
    const query = `INSERT INTO v2_user (id, firstname, lastname, email, role, status, lastlogin, onboarding_id) VALUES (${data.join(', ')}) RETURNING *`;
    const response = await this.db.query(query, data);
    return response
  }

  async read(id:any): Promise<v2_user[] | any[]> {
    const query = `SELECT * FROM v2_user WHERE id = ${id}`;
    const response = await this.db.query(query, [id]);
    return response
  }

  async exists(id:any): Promise<boolean> {
    const query = `SELECT * FROM v2_user WHERE id = ${id}`;
    const response = await this.db.query(query, [id]);
    return response.length > 0 ? true : false;
  }

  async update(id:any, data:any): Promise<v2_user | undefined> {
    const query = `UPDATE v2_user SET ${this.db.as.values(data)} WHERE id = ${id} RETURNING *`;
    const response = await this.db.query(query, data);
    return response
  }

  async delete(id:any): Promise<v2_user | undefined> {
    const query = `DELETE FROM v2_user WHERE id = ${id} RETURNING *`;
    const response = await this.db.query(query, [id]);
    return response
  }
}
