import yaml from 'js-yaml';

const raw = (m: Record<string, unknown>) => Object.values(m) as string[];
const config = yaml.load(raw(import.meta.glob('./config.yaml', { query: '?raw', import: 'default', eager: true }))[0]) as any;
const funding = yaml.load(raw(import.meta.glob('./funding.yaml', { query: '?raw', import: 'default', eager: true }))[0]) as any;

export type Direction = {
  id: string; title: string; status: string; hours: number; claims: string[];
  question: string; why: string; falsifier: string; plan: string;
  cost: number; pledged: number; received: number; pct: number; ready: boolean;
};

export const sponsorsUrl: string = config.sponsors_url;
export const rate: number = config.rate_per_hour;

export function directions(): Direction[] {
  const files = import.meta.glob('./directions/*.yaml', { query: '?raw', import: 'default', eager: true });
  return Object.values(files).map((t) => {
    const d = yaml.load(t as string) as any;
    const f = funding[d.id] ?? {};
    const cost = d.hours * rate;
    const pledged = f.pledged ?? 0, received = f.received ?? 0;
    return { ...d, cost, pledged, received,
      pct: Math.min(100, Math.round(((pledged + received) / cost) * 100)),
      ready: received >= cost };
  }).sort((a, b) => b.pct - a.pct || a.hours - b.hours);
}

export const fundUrl = (id: string, how: 'sponsors' | 'collective') =>
  `#TBD-${how === 'sponsors' ? 'github-sponsors' : 'open-collective'}?direction=${id}`;
