import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { getDb, queryAll, queryOne, execute, resetDatabase } from "./src/db/database.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize SQLite database
  await getDb();

  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // ==================== HEALTH & STATS ====================
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ==================== CATEGORIES API ====================
  app.get("/api/categories", (req, res) => {
    try {
      const categories = queryAll("SELECT * FROM categories ORDER BY id ASC");
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/categories", (req, res) => {
    try {
      const { name, slug, description, icon, color } = req.body;
      if (!name || !slug) {
        return res.status(400).json({ error: "Name and slug are required" });
      }
      execute(
        "INSERT INTO categories (name, slug, description, icon, color) VALUES (?, ?, ?, ?, ?)",
        [name, slug, description || "", icon || "Folder", color || "#89906F"]
      );
      const created = queryOne("SELECT * FROM categories WHERE slug = ?", [slug]);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/categories/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { name, slug, description, icon, color } = req.body;
      execute(
        "UPDATE categories SET name = ?, slug = ?, description = ?, icon = ?, color = ? WHERE id = ?",
        [name, slug, description, icon, color, id]
      );
      const updated = queryOne("SELECT * FROM categories WHERE id = ?", [id]);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/categories/:id", (req, res) => {
    try {
      const { id } = req.params;
      execute("DELETE FROM categories WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==================== TOOLS API ====================
  app.get("/api/tools", (req, res) => {
    try {
      const { category, featured, trending, search } = req.query;
      let sql = "SELECT * FROM tools WHERE 1=1";
      const params: any[] = [];

      if (category) {
        sql += " AND category = ?";
        params.push(category);
      }
      if (featured !== undefined) {
        sql += " AND featured = ?";
        params.push(Number(featured));
      }
      if (trending !== undefined) {
        sql += " AND trending = ?";
        params.push(Number(trending));
      }
      if (search) {
        sql += " AND (name LIKE ? OR short_description LIKE ? OR keywords LIKE ?)";
        const term = `%${search}%`;
        params.push(term, term, term);
      }

      sql += " ORDER BY usage_count DESC, id ASC";
      const tools = queryAll(sql, params);
      res.json(tools);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/tools/:slug", (req, res) => {
    try {
      const { slug } = req.params;
      const tool = queryOne("SELECT * FROM tools WHERE slug = ?", [slug]);
      if (!tool) {
        return res.status(404).json({ error: "Tool not found" });
      }
      res.json(tool);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/tools/:slug/use", (req, res) => {
    try {
      const { slug } = req.params;
      execute("UPDATE tools SET usage_count = usage_count + 1 WHERE slug = ?", [slug]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/tools", (req, res) => {
    try {
      const {
        name,
        slug,
        short_description,
        full_description,
        category,
        keywords,
        faq,
        icon,
        featured,
        trending
      } = req.body;

      if (!name || !slug || !category) {
        return res.status(400).json({ error: "Name, slug, and category are required" });
      }

      execute(
        `INSERT INTO tools (name, slug, short_description, full_description, category, keywords, faq, icon, featured, trending, usage_count, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))`,
        [
          name,
          slug,
          short_description || "",
          full_description || "",
          category,
          keywords || "",
          typeof faq === 'string' ? faq : JSON.stringify(faq || []),
          icon || "Wrench",
          featured ? 1 : 0,
          trending ? 1 : 0
        ]
      );
      const created = queryOne("SELECT * FROM tools WHERE slug = ?", [slug]);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/tools/:id", (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        slug,
        short_description,
        full_description,
        category,
        keywords,
        faq,
        icon,
        featured,
        trending
      } = req.body;

      execute(
        `UPDATE tools SET name = ?, slug = ?, short_description = ?, full_description = ?, category = ?, 
         keywords = ?, faq = ?, icon = ?, featured = ?, trending = ?, updated_at = datetime('now') WHERE id = ?`,
        [
          name,
          slug,
          short_description,
          full_description,
          category,
          keywords,
          typeof faq === 'string' ? faq : JSON.stringify(faq || []),
          icon,
          featured ? 1 : 0,
          trending ? 1 : 0,
          id
        ]
      );
      const updated = queryOne("SELECT * FROM tools WHERE id = ?", [id]);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/tools/:id", (req, res) => {
    try {
      const { id } = req.params;
      execute("DELETE FROM tools WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==================== BLOGS API ====================
  app.get("/api/blogs", (req, res) => {
    try {
      const { published, category, search } = req.query;
      let sql = "SELECT * FROM blogs WHERE 1=1";
      const params: any[] = [];

      if (published !== undefined) {
        sql += " AND published = ?";
        params.push(Number(published));
      }
      if (category) {
        sql += " AND category = ?";
        params.push(category);
      }
      if (search) {
        sql += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR tags LIKE ?)";
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }

      sql += " ORDER BY created_at DESC";
      const blogs = queryAll(sql, params);
      res.json(blogs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/blogs/:slug", (req, res) => {
    try {
      const { slug } = req.params;
      const blog = queryOne("SELECT * FROM blogs WHERE slug = ?", [slug]);
      if (!blog) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(blog);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blogs", (req, res) => {
    try {
      const {
        title,
        slug,
        excerpt,
        content,
        author,
        category,
        tags,
        featured_image,
        seo_title,
        seo_description,
        published
      } = req.body;

      if (!title || !slug) {
        return res.status(400).json({ error: "Title and slug are required" });
      }

      execute(
        `INSERT INTO blogs (title, slug, excerpt, content, author, category, tags, featured_image, seo_title, seo_description, published, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [
          title,
          slug,
          excerpt || "",
          content || "",
          author || "ToolVerse Editorial",
          category || "General",
          tags || "",
          featured_image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
          seo_title || title,
          seo_description || excerpt || "",
          published !== undefined ? (published ? 1 : 0) : 1
        ]
      );
      const created = queryOne("SELECT * FROM blogs WHERE slug = ?", [slug]);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/blogs/:id", (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        slug,
        excerpt,
        content,
        author,
        category,
        tags,
        featured_image,
        seo_title,
        seo_description,
        published
      } = req.body;

      execute(
        `UPDATE blogs SET title = ?, slug = ?, excerpt = ?, content = ?, author = ?, category = ?, 
         tags = ?, featured_image = ?, seo_title = ?, seo_description = ?, published = ?, updated_at = datetime('now') WHERE id = ?`,
        [
          title,
          slug,
          excerpt,
          content,
          author,
          category,
          tags,
          featured_image,
          seo_title,
          seo_description,
          published ? 1 : 0,
          id
        ]
      );
      const updated = queryOne("SELECT * FROM blogs WHERE id = ?", [id]);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/blogs/:id", (req, res) => {
    try {
      const { id } = req.params;
      execute("DELETE FROM blogs WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==================== FAQS API ====================
  app.get("/api/faqs", (req, res) => {
    try {
      const faqs = queryAll("SELECT * FROM faqs ORDER BY id ASC");
      res.json(faqs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/faqs", (req, res) => {
    try {
      const { question, answer, category } = req.body;
      if (!question || !answer) {
        return res.status(400).json({ error: "Question and answer are required" });
      }
      execute("INSERT INTO faqs (question, answer, category) VALUES (?, ?, ?)", [
        question,
        answer,
        category || "General"
      ]);
      const created = queryOne("SELECT * FROM faqs ORDER BY id DESC LIMIT 1");
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/faqs/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { question, answer, category } = req.body;
      execute("UPDATE faqs SET question = ?, answer = ?, category = ? WHERE id = ?", [
        question,
        answer,
        category,
        id
      ]);
      const updated = queryOne("SELECT * FROM faqs WHERE id = ?", [id]);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/faqs/:id", (req, res) => {
    try {
      const { id } = req.params;
      execute("DELETE FROM faqs WHERE id = ?", [id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==================== CONTACT MESSAGES API ====================
  app.get("/api/contact", (req, res) => {
    try {
      const messages = queryAll("SELECT * FROM contact_messages ORDER BY created_at DESC");
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/contact", (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }
      execute(
        "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
        [name, email, subject || "General Inquiry", message]
      );
      res.status(201).json({ success: true, message: "Thank you! Your message has been received." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==================== INSTANT SEARCH API ====================
  app.get("/api/search", (req, res) => {
    try {
      const q = ((req.query.q as string) || "").trim();
      if (!q) {
        return res.json([]);
      }

      const term = `%${q}%`;
      const tools = queryAll(
        `SELECT id, name as title, short_description as description, slug, category, icon, 'tool' as type 
         FROM tools 
         WHERE name LIKE ? OR short_description LIKE ? OR keywords LIKE ? OR category LIKE ?
         LIMIT 8`,
        [term, term, term, term]
      );

      const blogs = queryAll(
        `SELECT id, title, excerpt as description, slug, category, 'blog' as type 
         FROM blogs 
         WHERE published = 1 AND (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)
         LIMIT 4`,
        [term, term, term]
      );

      const categories = queryAll(
        `SELECT id, name as title, description, slug, icon, 'category' as type 
         FROM categories 
         WHERE name LIKE ? OR description LIKE ?
         LIMIT 3`,
        [term, term]
      );

      res.json([...tools, ...categories, ...blogs]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==================== AI GENERATION API (GEMINI 3.7 FLASH) ====================
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { toolType, payload } = req.body;

      if (!toolType) {
        return res.status(400).json({ error: "toolType is required" });
      }

      const client = getGeminiClient();

      let systemInstruction = "You are an expert AI copywriting and productivity assistant on the ToolVerse platform. Provide structured, high-value, crisp, and ready-to-use output.";
      let userPrompt = "";

      switch (toolType) {
        case "ai-prompt-generator":
          userPrompt = `Generate a master-level AI prompt based on:
- Target Role/Persona: ${payload.role || "Expert Consultant"}
- Objective/Task: ${payload.task || "Help solve a problem"}
- Context/Background: ${payload.context || "Standard business context"}
- Desired Tone: ${payload.tone || "Professional"}
- Desired Output Format: ${payload.format || "Markdown with step-by-step instructions"}

Format your response cleanly with:
1. Master Prompt (in a copyable markdown codeblock)
2. Variable Placeholders Guide
3. Pro-Tips for best results.`;
          break;

        case "ai-email-generator":
          userPrompt = `Draft an email based on:
- Purpose: ${payload.purpose || "Follow-up"}
- Recipient: ${payload.recipient || "Colleague/Client"}
- Relationship: ${payload.relationship || "Professional"}
- Key Points to Include: ${payload.points || "General check-in"}
- Tone: ${payload.tone || "Professional and warm"}

Provide:
1. 3 Catchy Subject Line Options
2. Complete Body Text
3. Sign-off options.`;
          break;

        case "ai-caption-generator":
          userPrompt = `Write 3 engaging social media captions for ${payload.platform || "Instagram"}:
- Topic/Context: ${payload.context || "Exciting product launch"}
- Target Audience: ${payload.audience || "General"}
- Mood/Vibe: ${payload.mood || "Energetic and inspiring"}
- Include Emojis: ${payload.includeEmojis !== false ? "Yes" : "No"}

Provide 3 distinct variations (Story Hook, Short & Punchy, Question-driven) each with 5-8 relevant hashtags.`;
          break;

        case "ai-headline-generator":
          userPrompt = `Generate 10 magnetic, high-CTR headlines for:
- Topic: ${payload.topic || "Productivity and AI"}
- Target Audience: ${payload.audience || "Entrepreneurs and Creators"}
- Preferred Angle: ${payload.angle || "How-To & High Value"}

Categorize them under:
- How-To Headlines
- Listicle Headlines
- Curiosity Gap Headlines
- Direct Benefit Headlines
- Bold Statement Headlines.`;
          break;

        case "ai-hashtag-generator":
          userPrompt = `Generate a strategic set of hashtags for:
- Topic / Niche: ${payload.niche || "Digital Marketing"}
- Target Platform: ${payload.platform || "Instagram & TikTok"}
- Target Quantity: ${payload.quantity || "25"}

Categorize into:
1. High Competition / Broad Reach (5-8 tags)
2. Medium Competition / Targeted (10-12 tags)
3. Niche / Community Tags (8-10 tags)
Provide a ready-to-copy single block at the end.`;
          break;

        case "ai-product-description-generator":
          userPrompt = `Write a high-converting e-commerce product description for:
- Product Name: ${payload.productName || "Smart Ergonomic Desk"}
- Key Features: ${payload.features || "Adjustable height, oak wood finish, quiet motor"}
- Target Customer: ${payload.targetCustomer || "Remote workers and designers"}
- Brand Voice: ${payload.brandVoice || "Premium, modern, minimalist"}

Provide:
1. Compelling Hero Hook / Headline
2. Story-driven Description paragraph
3. Bulleted Key Features & Benefits
4. Quick Specs summary.`;
          break;

        case "text-summarizer":
          userPrompt = `Summarize the following text:
Length Style: ${payload.lengthStyle || "Key Bullet Points"}
Target Detail: ${payload.detail || "Medium"}

Original Text:
${payload.text}

Provide an Executive Summary sentence followed by 4-6 key structured takeaway bullets.`;
          break;

        case "grammar-checker":
          userPrompt = `Analyze and proofread the following text for grammar, spelling, punctuation, flow, and tone enhancements:

Text:
${payload.text}

Provide:
1. Polished & Corrected Version
2. Breakdown of Corrections (Original -> Replacement + Reason)
3. Readability & Tone Assessment Score (e.g. 95/100).`;
          break;

        default:
          userPrompt = payload.prompt || "Provide helpful productivity assistance.";
      }

      if (client) {
        const response = await client.models.generateContent({
          model: "gemini-3.7-flash",
          contents: userPrompt,
          config: {
            systemInstruction
          }
        });

        return res.json({
          result: response.text || "Generated successfully."
        });
      } else {
        // Fallback generator when Gemini API Key is not yet configured
        let fallbackResult = `[✨ AI Generated Result for ${toolType.replace(/-/g, ' ').toUpperCase()}]\n\n`;
        if (toolType === "ai-prompt-generator") {
          fallbackResult += `### Master Prompt:\n\n` +
            `"Act as an experienced ${payload.role || "Subject Matter Expert"}. Your objective is to ${payload.task || "deliver a comprehensive solution"}. ` +
            `Take into account the following context: ${payload.context || "Standard operating environment"}. ` +
            `Structure your response with clear headings, actionable examples, and deliver the output in ${payload.format || "structured markdown"}. ` +
            `Ensure the tone is strictly ${payload.tone || "professional"} and avoid fluff or generic platitudes."\n\n` +
            `### Pro-Tip:\nAttach any sample reference material or schemas right after this prompt for the highest fidelity response.`;
        } else if (toolType === "ai-email-generator") {
          fallbackResult += `Subject: ${payload.purpose || "Quick Update regarding our collaboration"}\n\n` +
            `Hi ${payload.recipient || "there"},\n\n` +
            `I hope your week is going smoothly.\n\n` +
            `I am reaching out regarding ${payload.purpose || "our recent discussion"}. Specifically:\n` +
            `• ${payload.points || "Following up on next milestones"}\n` +
            `• Ensuring alignment on priority deliverables\n\n` +
            `Please let me know if you have any questions or when you might be free for a brief sync.\n\n` +
            `Best regards,\n[Your Name]`;
        } else if (toolType === "ai-caption-generator") {
          fallbackResult += `Variation 1 (Engaging Story):\n` +
            `🚀 Big things don't happen overnight, but small consistency adds up fast! Here is our latest look into ${payload.context || "our newest project"}. Which detail stands out most to you? Drop a comment below! 👇\n\n` +
            `#${(payload.context || "workflow").replace(/\s+/g, '')} #productivity #inspiration #creators #growth\n\n` +
            `Variation 2 (Short & Punchy):\n` +
            `Simplicity meets power. ✨ ${payload.context || "Take your workflow to the next level."} Link in bio to learn more!\n\n` +
            `#innovation #tools #efficiency #design`;
        } else if (toolType === "ai-headline-generator") {
          const t = payload.topic || "Productivity Tools";
          fallbackResult += `1. How to Master ${t} in Less Than 10 Minutes a Day\n` +
            `2. 7 Proven ${t} Strategies Top Professionals Swear By\n` +
            `3. The Complete Step-by-Step Guide to ${t} in 2026\n` +
            `4. Why Most People Get ${t} Wrong (And How to Fix It)\n` +
            `5. Unlock 10x Speed with This Simple ${t} Framework\n` +
            `6. 5 Hidden Secrets About ${t} You Need to Know\n` +
            `7. Stop Wasting Time: The Modern Approach to ${t}\n` +
            `8. What Nobody Tells You About Getting Started with ${t}\n` +
            `9. The Ultimate ${t} Blueprint for High Achievers\n` +
            `10. Transform Your Results with This ${t} Playbook`;
        } else if (toolType === "ai-hashtag-generator") {
          const base = (payload.niche || "tech").toLowerCase().replace(/[^a-z0-9]/g, '');
          fallbackResult += `### Curated Hashtag Strategy:\n\n` +
            `#${base} #${base}life #${base}community #${base}tips #${base}daily ` +
            `#productivity #tools #digitalmarketing #creators #techtools #efficiency ` +
            `#growthmindset #workflow #innovation #software #onlinebusiness #saas`;
        } else if (toolType === "ai-product-description-generator") {
          fallbackResult += `### ${payload.productName || "Premium Product"} — Designed for Excellence\n\n` +
            `Experience unparalleled performance with the all-new ${payload.productName || "essential tool"}. ` +
            `Engineered meticulously for ${payload.targetCustomer || "modern creators and professionals"}, it combines effortless utility with timeless durability.\n\n` +
            `**Key Features & Highlights:**\n` +
            `• ${payload.features || "Premium construction and intuitive ergonomics"}\n` +
            `• Seamless performance built for everyday endurance\n` +
            `• Backed by our 100% satisfaction guarantee\n\n` +
            `Upgrade your setup today and feel the difference from day one.`;
        } else if (toolType === "text-summarizer") {
          const words = (payload.text || "").split(/\s+/).filter(Boolean);
          fallbackResult += `### Key Executive Summary:\n` +
            `The provided document analyzes core operational points across ${words.length} words, outlining key principles and strategic priorities.\n\n` +
            `### Main Takeaways:\n` +
            `• Primary focus is concentrated on efficiency, quality, and streamlined workflows.\n` +
            `• Consistent structure ensures predictable outcomes across key stages.\n` +
            `• Immediate application delivers noticeable productivity gains.`;
        } else {
          fallbackResult += `Processed request successfully with smart generator heuristics.\n\n` +
            `Tip: Add your Gemini API key in Settings > Secrets to unlock full live AI generative intelligence!`;
        }

        return res.json({ result: fallbackResult });
      }
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      res.status(500).json({ error: err.message || "Failed to generate AI response" });
    }
  });

  // ==================== ADMIN SYSTEM ACTIONS ====================
  app.post("/api/admin/reset-db", (req, res) => {
    try {
      resetDatabase();
      res.json({ success: true, message: "Database reset to factory seed data successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==================== DYNAMIC SEO: SITEMAP.XML & ROBOTS.TXT ====================
  app.get("/sitemap.xml", (req, res) => {
    try {
      const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
      const now = new Date().toISOString().split("T")[0];

      const tools = queryAll<{ slug: string; updated_at: string }>("SELECT slug, updated_at FROM tools");
      const blogs = queryAll<{ slug: string; updated_at: string }>("SELECT slug, updated_at FROM blogs WHERE published = 1");
      const categories = queryAll<{ slug: string }>("SELECT slug FROM categories");

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Static routes
      const staticPages = [
        { path: "", priority: "1.0", changefreq: "daily" },
        { path: "/categories", priority: "0.9", changefreq: "weekly" },
        { path: "/ai-tools", priority: "0.9", changefreq: "daily" },
        { path: "/writing-tools", priority: "0.9", changefreq: "daily" },
        { path: "/developer-tools", priority: "0.9", changefreq: "daily" },
        { path: "/image-tools", priority: "0.9", changefreq: "daily" },
        { path: "/pdf-tools", priority: "0.9", changefreq: "daily" },
        { path: "/blog", priority: "0.8", changefreq: "daily" },
        { path: "/favorites", priority: "0.6", changefreq: "monthly" },
        { path: "/about", priority: "0.5", changefreq: "monthly" },
        { path: "/contact", priority: "0.5", changefreq: "monthly" },
        { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
        { path: "/terms", priority: "0.3", changefreq: "yearly" },
      ];

      for (const page of staticPages) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
      }

      // Categories
      for (const cat of categories) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/category/${cat.slug}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }

      // Tools
      for (const tool of tools) {
        const lastmod = tool.updated_at ? tool.updated_at.split(" ")[0] : now;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/tools/${tool.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.85</priority>\n`;
        xml += `  </url>\n`;
      }

      // Blogs
      for (const blog of blogs) {
        const lastmod = blog.updated_at ? blog.updated_at.split(" ")[0] : now;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/blog/${blog.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(xml);
    } catch (err: any) {
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
  });

  // ==================== VITE MIDDLEWARE / SPA FALLBACK ====================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ToolVerse server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
