import axios, { AxiosInstance } from 'axios';
import type { DnsRecordInput } from '@shared/types';

export type Zone = {
  id: string;
  name: string;
  status: 'active' | 'pending' | string;
  name_servers?: string[];
};

export type DnsRecord = {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied?: boolean;
};

export class CloudflareClient {
  private http: AxiosInstance;
  constructor(private token: string, private accountId: string) {
    this.http = axios.create({
      baseURL: 'https://api.cloudflare.com/client/v4',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createZone(domain: string): Promise<Zone> {
    const { data } = await this.http.post('/zones', {
      name: domain,
      account: { id: this.accountId },
      type: 'full',
      jump_start: false,
    });
    if (!data.success) throw new Error(data.errors?.[0]?.message || 'CF create zone failed');
    return data.result as Zone;
  }

  async findZoneByName(domain: string): Promise<Zone | null> {
    const { data } = await this.http.get('/zones', { params: { name: domain, per_page: 1 } });
    if (!data.success) throw new Error(data.errors?.[0]?.message || 'CF list zones failed');
    return (data.result?.[0] as Zone) ?? null;
  }

  async listDns(zoneId: string): Promise<DnsRecord[]> {
    const { data } = await this.http.get(`/zones/${zoneId}/dns_records`, {
      params: { per_page: 100 },
    });
    if (!data.success) throw new Error('CF list dns failed');
    return data.result as DnsRecord[];
  }

  async createDns(zoneId: string, rec: DnsRecordInput): Promise<DnsRecord> {
    const { data } = await this.http.post(`/zones/${zoneId}/dns_records`, rec);
    if (!data.success) throw new Error(data.errors?.[0]?.message || 'CF create dns failed');
    return data.result as DnsRecord;
  }

  async updateDns(zoneId: string, id: string, rec: Partial<DnsRecordInput>): Promise<DnsRecord> {
    const { data } = await this.http.put(`/zones/${zoneId}/dns_records/${id}`, rec);
    if (!data.success) throw new Error(data.errors?.[0]?.message || 'CF update dns failed');
    return data.result as DnsRecord;
  }

  async deleteDns(zoneId: string, id: string): Promise<boolean> {
    const { data } = await this.http.delete(`/zones/${zoneId}/dns_records/${id}`);
    if (!data.success) throw new Error(data.errors?.[0]?.message || 'CF delete dns failed');
    return true;
  }
}
