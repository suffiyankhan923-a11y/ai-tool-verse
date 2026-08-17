import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { seedCategories, seedTools, seedBlogs, seedFaqs } from './seedData.js';

let dbInstance: Database | null = null;
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'toolverse.sqlite');

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let db: Database;
  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
    } catch (err) {
      console.warn('Failed to read existing sqlite file, creating fresh DB:', err);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  dbInstance = db;
  initSchemaAndSeed(db);
  saveDb();
  return dbInstance;
}

export function saveDb() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Error saving SQLite database to disk:', err);
  }
}

function initSchemaAndSeed(db: Database) {
  // 1. Categories Table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      icon TEXT,
      color TEXT
    );
  `);

  // 2. Tools Table
  db.run(`
    CREATE TABLE IF NOT EXISTS tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      short_description TEXT NOT NULL,
      full_description TEXT NOT NULL,
      category TEXT NOT NULL,
      keywords TEXT NOT NULL,
      faq TEXT NOT NULL,
      icon TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      trending INTEGER DEFAULT 0,
      usage_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Blogs Table
  db.run(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL,
      featured_image TEXT NOT NULL,
      seo_title TEXT NOT NULL,
      seo_description TEXT NOT NULL,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. FAQs Table
  db.run(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT DEFAULT 'General'
    );
  `);

  // 5. Contact Messages Table
  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed Categories if empty
  const catCount = db.exec("SELECT COUNT(*) as count FROM categories")[0]?.values[0]?.[0] || 0;
  if (catCount === 0) {
    for (const cat of seedCategories) {
      db.run(
        "INSERT INTO categories (name, slug, description, icon, color) VALUES (?, ?, ?, ?, ?)",
        [cat.name, cat.slug, cat.description, cat.icon, cat.color]
      );
    }
  }

  // Seed Tools if empty
  const toolCount = db.exec("SELECT COUNT(*) as count FROM tools")[0]?.values[0]?.[0] || 0;
  if (toolCount === 0) {
    for (const tool of seedTools) {
      db.run(
        `INSERT INTO tools (name, slug, short_description, full_description, category, keywords, faq, icon, featured, trending, usage_count) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tool.name,
          tool.slug,
          tool.short_description,
          tool.full_description,
          tool.category,
          tool.keywords,
          tool.faq,
          tool.icon,
          tool.featured,
          tool.trending,
          Math.floor(Math.random() * 500) + 50
        ]
      );
    }
  }

  // Seed Blogs if empty
  const blogCount = db.exec("SELECT COUNT(*) as count FROM blogs")[0]?.values[0]?.[0] || 0;
  if (blogCount === 0) {
    for (const blog of seedBlogs) {
      db.run(
        `INSERT INTO blogs (title, slug, excerpt, content, author, category, tags, featured_image, seo_title, seo_description, published)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          blog.title,
          blog.slug,
          blog.excerpt,
          blog.content,
          blog.author,
          blog.category,
          blog.tags,
          blog.featured_image,
          blog.seo_title,
          blog.seo_description,
          blog.published
        ]
      );
    }
  }

  // Seed FAQs if empty
  const faqCount = db.exec("SELECT COUNT(*) as count FROM faqs")[0]?.values[0]?.[0] || 0;
  if (faqCount === 0) {
    for (const faq of seedFaqs) {
      db.run(
        "INSERT INTO faqs (question, answer, category) VALUES (?, ?, ?)",
        [faq.question, faq.answer, faq.category]
      );
    }
  }
}

// Query helper for returning array of objects
export function queryAll<T = any>(sql: string, params: any[] = []): T[] {
  if (!dbInstance) throw new Error("Database not initialized");
  const stmt = dbInstance.prepare(sql);
  stmt.bind(params);
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

// Query helper for returning single object
export function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  const rows = queryAll<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// Execute query (INSERT, UPDATE, DELETE)
export function execute(sql: string, params: any[] = []): void {
  if (!dbInstance) throw new Error("Database not initialized");
  dbInstance.run(sql, params);
  saveDb();
}

// Reset database to initial seeds
export function resetDatabase(): void {
  if (!dbInstance) throw new Error("Database not initialized");
  dbInstance.run("DROP TABLE IF EXISTS tools;");
  dbInstance.run("DROP TABLE IF EXISTS blogs;");
  dbInstance.run("DROP TABLE IF EXISTS categories;");
  dbInstance.run("DROP TABLE IF EXISTS faqs;");
  dbInstance.run("DROP TABLE IF EXISTS contact_messages;");
  initSchemaAndSeed(dbInstance);
  saveDb();
}
