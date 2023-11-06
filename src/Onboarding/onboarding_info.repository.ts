
import { Pool } from 'pg';
import { onboarding_info } from './onboarding_info.model'
export class onboarding_infoRepository {
  db: any;
  constructor() {
    this.db = new Pool(/* your database configuration */);
  }

  async create(data:any): Promise<onboarding_info | undefined> {
    const query = `INSERT INTO onboarding_info (id, client, script_url, web_account_id, web_id, validated, status, isdashboardready) VALUES (${data.join(', ')}) RETURNING *`;
    const response = await this.db.query(query, data);
    return response
  }

  async read(id:any): Promise<onboarding_info[] | any[]> {
    const query = `SELECT * FROM onboarding_info WHERE id = ${id}`;
    const response = await this.db.query(query, [id]);
    return response
  }

  async exists(id:any): Promise<boolean> {
    const query = `SELECT * FROM onboarding_info WHERE id = ${id}`;
    const response = await this.db.query(query, [id]);
    return response.length > 0 ? true : false;
  }

  async update(id:any, data:any): Promise<onboarding_info | undefined> {
    const query = `UPDATE onboarding_info SET ${this.db.as.values(data)} WHERE id = ${id} RETURNING *`;
    const response = await this.db.query(query, data);
    return response
  }

  async delete(id:any): Promise<onboarding_info | undefined> {
    const query = `DELETE FROM onboarding_info WHERE id = ${id} RETURNING *`;
    const response = await this.db.query(query, [id]);
    return response
  }
}
