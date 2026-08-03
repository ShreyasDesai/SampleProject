import { promises as fs } from "fs";
import path from "path";
import { normalizeDomain, normalizeUrl } from "./http";

export interface Project {
  id: string;
  name: string;
  domain: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  lastAuditAt?: string;
  trackedKeywords: string[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "projects.json");

async function ensure() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, JSON.stringify({ projects: [] }, null, 2));
  }
}

async function readAll(): Promise<Project[]> {
  await ensure();
  const raw = await fs.readFile(FILE, "utf8");
  const parsed = JSON.parse(raw) as { projects: Project[] };
  return parsed.projects || [];
}

async function writeAll(projects: Project[]) {
  await ensure();
  await fs.writeFile(FILE, JSON.stringify({ projects }, null, 2));
}

export async function listProjects() {
  return readAll();
}

export async function getProject(id: string) {
  return (await readAll()).find((p) => p.id === id) || null;
}

export async function upsertProject(input: {
  url: string;
  name?: string;
  trackedKeywords?: string[];
}) {
  const url = normalizeUrl(input.url);
  const domain = normalizeDomain(url);
  const projects = await readAll();
  const existing = projects.find((p) => p.domain === domain);
  const now = new Date().toISOString();
  if (existing) {
    existing.url = url;
    existing.name = input.name || existing.name || domain;
    existing.updatedAt = now;
    if (input.trackedKeywords) existing.trackedKeywords = input.trackedKeywords;
    await writeAll(projects);
    return existing;
  }
  const project: Project = {
    id: `proj_${domain.replace(/\W+/g, "_")}_${Date.now().toString(36)}`,
    name: input.name || domain,
    domain,
    url,
    createdAt: now,
    updatedAt: now,
    trackedKeywords: input.trackedKeywords || [],
  };
  projects.unshift(project);
  await writeAll(projects);
  return project;
}

export async function touchAudit(id: string) {
  const projects = await readAll();
  const project = projects.find((p) => p.id === id);
  if (!project) return null;
  project.lastAuditAt = new Date().toISOString();
  project.updatedAt = project.lastAuditAt;
  await writeAll(projects);
  return project;
}

export async function addTrackedKeywords(id: string, keywords: string[]) {
  const projects = await readAll();
  const project = projects.find((p) => p.id === id);
  if (!project) return null;
  const set = new Set([...project.trackedKeywords, ...keywords.map((k) => k.trim().toLowerCase()).filter(Boolean)]);
  project.trackedKeywords = [...set].slice(0, 100);
  project.updatedAt = new Date().toISOString();
  await writeAll(projects);
  return project;
}
