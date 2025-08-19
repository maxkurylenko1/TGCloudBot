export type DnsRecordInput = {
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX' | 'NS' | 'SRV' | 'CAA' | 'PTR';
  name: string; // @, www, sub.example.com
  content: string; // 1.2.3.4, target host, text, etc
  ttl?: number; // seconds
  proxied?: boolean; // for A/AAAA/CNAME
  priority?: number; // for MX/SRV
};
