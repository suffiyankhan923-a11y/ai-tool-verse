-- ====================================================================
-- TOOLVERSE — SUPABASE DATABASE SCHEMA & COMPLETE DATA IMPORTER
-- Platform: Supabase (PostgreSQL 15+)
-- Generated: 2026-08-18T11:31:36.589Z
-- Total Categories: 12
-- Total Precision Tools: 86
-- Total Blog Guides: 12
-- Instructions:
--   1. Open your Supabase Project (https://supabase.com/dashboard)
--   2. Navigate to "SQL Editor" in the left sidebar
--   3. Paste this complete SQL script into a new query and click "Run" (⌘ + Enter)
--   4. Open "Table Editor" to see all populated tables!
-- ====================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. RESET & CLEANUP EXISTING TABLES (OPTIONAL / SAFE TO RUN)
-- ====================================================================
DROP TABLE IF EXISTS tool_analytics CASCADE;
DROP TABLE IF EXISTS user_feedback CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- ====================================================================
-- 3. SCHEMA DEFINITION: CATEGORIES TABLE
-- ====================================================================
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Wrench',
  color TEXT NOT NULL DEFAULT 'from-amber-500/20 to-yellow-600/20 text-amber-500',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 4. SCHEMA DEFINITION: TOOLS TABLE
-- ====================================================================
CREATE TABLE tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE,
  description TEXT NOT NULL,
  long_description TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Calculator',
  keywords TEXT[] NOT NULL DEFAULT '{}'::text[],
  featured BOOLEAN NOT NULL DEFAULT false,
  popular BOOLEAN NOT NULL DEFAULT false,
  is_new BOOLEAN NOT NULL DEFAULT false,
  how_to_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  how_it_works TEXT,
  example_scenario JSONB NOT NULL DEFAULT '{}'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  related_tool_ids TEXT[] NOT NULL DEFAULT '{}'::text[],
  disclaimer_type TEXT NOT NULL DEFAULT 'general' CHECK (disclaimer_type IN ('financial', 'health', 'general')),
  views_count BIGINT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 5. SCHEMA DEFINITION: BLOGS / GUIDES TABLE
-- ====================================================================
CREATE TABLE blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_avatar TEXT,
  published_date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  related_tool_slugs TEXT[] NOT NULL DEFAULT '{}'::text[],
  content TEXT NOT NULL,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  views_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 6. SCHEMA DEFINITION: SITE SETTINGS TABLE
-- ====================================================================
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'ToolVerse',
  site_tagline TEXT NOT NULL DEFAULT 'Precision Online Tools for Everyday Life',
  site_url TEXT NOT NULL DEFAULT 'https://toolverse.app',
  contact_email TEXT NOT NULL DEFAULT 'support@toolverse.app',
  primary_color TEXT NOT NULL DEFAULT '#D4AF37',
  enable_ads BOOLEAN NOT NULL DEFAULT false,
  adsense_client_id TEXT,
  ga_tracking_id TEXT,
  meta_title TEXT NOT NULL DEFAULT 'ToolVerse — Free Online Calculators, Converters & Developer Utilities',
  meta_description TEXT NOT NULL DEFAULT 'Access 70+ free online tools with zero sign-up required. 100% private, instant, and mobile-friendly.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 7. SCHEMA DEFINITION: TOOL ANALYTICS & USAGE LOGS
-- ====================================================================
CREATE TABLE tool_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id TEXT REFERENCES tools(id) ON DELETE SET NULL,
  tool_slug TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'tool_view',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 8. SCHEMA DEFINITION: USER FEEDBACK & TOOL REQUESTS
-- ====================================================================
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  message TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  tool_slug TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'implemented', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 9. PERFORMANCE OPTIMIZATION INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_tools_popular ON tools(popular) WHERE popular = true;
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_analytics_tool_slug ON tool_analytics(tool_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON tool_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON user_feedback(created_at DESC);

-- ====================================================================
-- 10. ROW LEVEL SECURITY (RLS) & ACCESS CONTROL POLICIES
-- ====================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Authenticated write
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin All Categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tools: Public read active tools, Authenticated write
CREATE POLICY "Public Read Tools" ON tools FOR SELECT USING (is_active = true);
CREATE POLICY "Admin All Tools" ON tools FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Blogs: Public read published blogs, Authenticated write
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Admin All Blogs" ON blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Site Settings: Public read, Authenticated write
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin All Settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Analytics & Feedback: Public insert, Authenticated read/manage
CREATE POLICY "Public Insert Analytics" ON tool_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Read Analytics" ON tool_analytics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public Insert Feedback" ON user_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin All Feedback" ON user_feedback FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ====================================================================
-- 11. SEED DATA: CATEGORIES (12 RECORDS)
-- ====================================================================
INSERT INTO categories (id, name, slug, description, icon_name, color, display_order)
VALUES
('calculators', 'Calculators', 'calculators', 'Everyday math, age, discount, tip, percentage, and date calculators with instant accurate results.', 'Calculator', 'from-amber-500/20 to-yellow-600/20 text-amber-500', 1),
('converters', 'Converters', 'converters', 'Comprehensive unit converters for length, weight, temperature, currency, area, volume, and data.', 'ArrowLeftRight', 'from-blue-500/20 to-indigo-600/20 text-blue-400', 2),
('text-tools', 'Text Tools', 'text-tools', 'Transform, analyze, count, format, deduplicate, and clean up your text effortlessly.', 'Type', 'from-emerald-500/20 to-teal-600/20 text-emerald-400', 3),
('image-tools', 'Image Tools', 'image-tools', 'Client-side image compression, resizing, cropping, and format conversion with zero upload latency.', 'Image', 'from-purple-500/20 to-pink-600/20 text-purple-400', 4),
('developer-tools', 'Developer Tools', 'developer-tools', 'Fast JSON formatters, Base64 converters, UUID generators, hashers, and web encoding utilities.', 'Code2', 'from-cyan-500/20 to-blue-600/20 text-cyan-400', 5),
('seo-tools', 'SEO Tools', 'seo-tools', 'Generate meta tags, robots.txt, sitemaps, Open Graph cards, SERP previews, and check keyword density.', 'SearchCheck', 'from-orange-500/20 to-amber-600/20 text-orange-400', 6),
('finance-tools', 'Finance Tools', 'finance-tools', 'Mortgage, loan, compound interest, salary, profit margin, and investment growth estimators.', 'Coins', 'from-yellow-500/20 to-amber-600/20 text-yellow-500', 7),
('date-time', 'Date & Time Tools', 'date-time', 'Time difference, date arithmetic, workday counters, and multi-timezone schedulers.', 'CalendarClock', 'from-sky-500/20 to-indigo-600/20 text-sky-400', 8),
('productivity', 'Productivity Tools', 'productivity', 'Pomodoro focus timer, stopwatch, habit tracker, random decision maker, and quick scratchpad.', 'Flame', 'from-rose-500/20 to-red-600/20 text-rose-400', 9),
('health', 'Health & Fitness', 'health', 'BMI, BMR, TDEE, calorie target, ideal weight, body fat, and running pace calculators.', 'HeartPulse', 'from-green-500/20 to-emerald-600/20 text-green-400', 10),
('generators', 'Generators', 'generators', 'High-entropy password, QR code, random name, color palette, and CSS gradient generators.', 'Sparkles', 'from-violet-500/20 to-indigo-600/20 text-violet-400', 11),
('file-tools', 'File Tools', 'file-tools', 'Client-side file size converters, text file merge/splitter, and CSV-to-JSON format tools.', 'Files', 'from-slate-500/20 to-zinc-600/20 text-slate-400', 12)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();

-- ====================================================================
-- 12. SEED DATA: TOOLS (86 RECORDS)
-- ====================================================================
INSERT INTO tools (
  id, name, slug, category_id, description, long_description, icon_name,
  keywords, featured, popular, is_new, how_to_steps, how_it_works,
  example_scenario, faqs, related_tool_ids, disclaimer_type
)
VALUES
('age-calculator', 'Age Calculator', 'age-calculator', 'calculators', 'Calculate your exact age in years, months, days, hours, and minutes with next birthday countdown.', 'Our free Age Calculator precisely determines chronological age from a date of birth. View elapsed years, months, days, total hours, minutes, day of the week you were born, and countdown to your next birthday.', 'Cake', ARRAY['age calculator', 'calculate age', 'date of birth calculator', 'how old am i', 'exact age', 'next birthday countdown']::text[], true, true, false, '["Select or type your Date of Birth in the date picker.","Optionally adjust the \"Calculate Age As Of\" date (defaults to today).","Optionally specify your exact birth time for precise hour/minute calculation.","Instant breakdown displays your exact age, total days lived, zodiac sign, and next birthday countdown."]'::jsonb, 'The tool calculates calendar date differences taking into account leap years, variable month days (28, 29, 30, 31), and exact timestamp offsets in your local browser timezone without sending any data to servers.', '{"title":"Determining exact milestone age","description":"Born on May 14, 1995 calculating age on August 17, 2026","inputs":{"Date of Birth":"May 14, 1995","Current Date":"Aug 17, 2026"},"result":"31 Years, 3 Months, 3 Days (Total 11,418 days lived, Next birthday in 270 days)"}'::jsonb, '[{"question":"How is exact age calculated with leap years?","answer":"Our algorithm accounts for every leap year (366 days) in the elapsed timeframe, calculating full calendar year intervals first, followed by remaining complete months, and lastly residual calendar days."},{"question":"Does this tool store my date of birth?","answer":"No. All calculations are executed 100% locally in your browser using JavaScript client-side processing. Zero personal data is transmitted or saved."},{"question":"Can I calculate my age at a future or past date?","answer":"Yes! Simply change the \"Calculate Age As Of\" selector to any historical or future date to determine milestone ages for retirement, graduations, or visa applications."},{"question":"How does the next birthday countdown work?","answer":"It calculates the exact calendar day of your upcoming birthday in the current or subsequent year and computes the exact days, hours, and weekday remaining."}]'::jsonb, ARRAY['date-calculator', 'time-calculator', 'percentage-calculator']::text[], 'general'),
('percentage-calculator', 'Percentage Calculator', 'percentage-calculator', 'calculators', 'Calculate percentages, percentage increase or decrease, find X% of Y, and find base values instantly.', 'An all-in-one percentage calculation suite solving every common percentage problem: finding what X% of Y is, determining what percent X is of Y, calculating percentage increase/decrease, and margin/markup conversions.', 'Percent', ARRAY['percentage calculator', 'percent increase', 'percent decrease', 'what percent of', 'percent change formula']::text[], true, true, false, '["Choose your calculation mode (e.g. \"What is X% of Y?\", \"X is what % of Y?\", or \"Percentage Change\").","Enter the numeric values in the provided fields.","View the real-time calculated result, mathematical formula, and step-by-step breakdown."]'::jsonb, 'Utilizes standard algebraic formulas: Percentage = (Part / Whole) × 100, and Percentage Change = ((New Value - Old Value) / |Old Value|) × 100.', '{"title":"Calculating Year-over-Year Revenue Growth","description":"Revenue grew from $45,000 to $62,000","inputs":{"Original Value":"45000","New Value":"62000"},"result":"+37.78% increase (+$17,000 net change)"}'::jsonb, '[{"question":"How do you calculate percentage increase?","answer":"Subtract the original value from the new value, divide by the absolute original value, and multiply by 100."},{"question":"What is the formula for finding X% of Y?","answer":"Multiply X by Y and divide by 100: (X × Y) / 100."},{"question":"How do you reverse a percentage calculation?","answer":"To find the original price before a discount of D%, divide the discounted price by (1 - D/100)."}]'::jsonb, ARRAY['discount-calculator', 'profit-margin-calculator', 'gst-calculator']::text[], 'general'),
('bmi-calculator', 'BMI Calculator', 'bmi-calculator', 'health', 'Calculate your Body Mass Index (BMI), health category, and ideal healthy weight range in metric and imperial.', 'Calculates Body Mass Index (BMI) using WHO standard criteria. Provides visual health category indicators (Underweight, Normal, Overweight, Obese) and target healthy weight ranges based on height.', 'HeartPulse', ARRAY['bmi calculator', 'body mass index', 'calculate bmi', 'ideal weight', 'healthy weight range', 'bmi chart']::text[], true, true, false, '["Select Metric (cm, kg) or Imperial (feet/inches, lbs) units.","Enter your height and weight.","Review your BMI score, category tier, and recommended healthy weight span."]'::jsonb, 'Metric formula: weight (kg) / [height (m)]². Imperial formula: 703 × weight (lbs) / [height (in)]².', '{"title":"Checking adult fitness score","description":"Adult height 178 cm, weight 72 kg","inputs":{"Height":"178 cm","Weight":"72 kg"},"result":"BMI 22.7 (Normal / Healthy Weight. Healthy range: 58.6 - 79.2 kg)"}'::jsonb, '[{"question":"What is a normal BMI for adults?","answer":"According to the World Health Organization (WHO), a normal adult BMI falls between 18.5 and 24.9."},{"question":"Does BMI distinguish muscle from fat?","answer":"No. BMI is a screening metric based on height and weight. Athletes with high muscle mass may test higher without having excess body fat."},{"question":"Is this calculator a medical diagnosis?","answer":"No. This tool provides general estimates and should not replace clinical medical evaluation."}]'::jsonb, ARRAY['bmr-calculator', 'tdee-calculator', 'ideal-weight-calculator']::text[], 'health'),
('loan-calculator', 'Loan Calculator', 'loan-calculator', 'finance-tools', 'Calculate monthly loan payments, total interest, and total repayment schedule for personal or auto loans.', 'Estimate your monthly installment (EMI), total interest charges, and comprehensive amortization overview for personal, auto, or home loans with interactive term sliders.', 'Banknote', ARRAY['loan calculator', 'emi calculator', 'monthly loan payment', 'auto loan calculator', 'personal loan', 'interest calculator']::text[], true, true, false, '["Enter total loan principal amount.","Input the annual interest rate percentage (APR).","Select loan tenure in years or months.","Review monthly payment, total interest, and principal vs interest visual ratio."]'::jsonb, 'Uses the standard amortization formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1], where P is Principal, i is monthly interest rate, and n is total months.', '{"title":"Auto loan calculation","description":"$25,000 loan at 5.5% annual interest for 5 years (60 months)","inputs":{"Principal":"$25,000","Interest":"5.5%","Term":"5 years"},"result":"$477.53 / month | Total Interest: $3,651.80 | Total Repaid: $28,651.80"}'::jsonb, '[{"question":"How do extra payments lower total loan interest?","answer":"Making additional payments reduces the principal balance faster, resulting in less interest accruing over remaining billing periods."},{"question":"What is the difference between APR and interest rate?","answer":"The interest rate represents the base borrowing cost, whereas APR includes additional lender fees and charges."}]'::jsonb, ARRAY['mortgage-calculator', 'compound-interest-calculator', 'simple-interest-calculator']::text[], 'financial'),
('tip-calculator', 'Tip Calculator', 'tip-calculator', 'calculators', 'Easily calculate gratuity tips, split bills among friends, and see total per person with custom tip percentages.', 'Easily calculate gratuity tips, split bills among friends, and see total per person with custom tip percentages.', 'Receipt', ARRAY['tip calculator', 'gratuity calculator', 'split bill', 'restaurant tip calculator', 'bill splitter']::text[], false, false, false, '["Enter the total restaurant bill amount before tip.","Select standard tip percentages (10%, 15%, 18%, 20%, 25%) or enter a custom %.","Specify number of people splitting the bill.","View tip total, grand total, and individual person share."]'::jsonb, '', '{}'::jsonb, '[{"question":"What is standard tipping etiquette in the US?","answer":"Generally 15%–20% for standard to excellent table service, and 10%–15% for buffets or delivery."},{"question":"Should tip be calculated before or after sales tax?","answer":"Standard etiquette recommends tipping on the pre-tax food and beverage subtotal."}]'::jsonb, ARRAY['discount-calculator', 'gst-calculator', 'percentage-calculator']::text[], 'general'),
('discount-calculator', 'Discount Calculator', 'discount-calculator', 'calculators', 'Calculate sale savings, discounted price, additional coupon stacking, and tax on discounted items.', 'Calculate sale savings, discounted price, additional coupon stacking, and tax on discounted items.', 'Tag', ARRAY['discount calculator', 'sale price calculator', 'percent off calculator', 'coupon discount', 'shopping savings']::text[], false, false, false, '["Enter the original list price.","Enter primary discount percentage.","Optionally enter an additional stacked coupon or promo code percentage.","Optionally add local sales tax rate to find final register price."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['percentage-calculator', 'gst-calculator', 'profit-margin-calculator']::text[], 'general'),
('gst-calculator', 'GST / VAT Calculator', 'gst-calculator', 'finance-tools', 'Calculate Goods & Services Tax (GST) or Value Added Tax (VAT) with Inclusive and Exclusive options.', 'Calculate Goods & Services Tax (GST) or Value Added Tax (VAT) with Inclusive and Exclusive options.', 'FileSpreadsheet', ARRAY['gst calculator', 'vat calculator', 'sales tax calculator', 'tax inclusive', 'tax exclusive']::text[], false, false, false, '["Enter your base amount.","Select standard GST/VAT rate (5%, 12%, 18%, 20%, 28%) or custom rate.","Choose \"GST Inclusive\" or \"GST Exclusive\" mode.","Get net amount, tax amount, and total gross value."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['tax-calculator', 'discount-calculator', 'salary-calculator']::text[], 'financial'),
('compound-interest-calculator', 'Compound Interest Calculator', 'compound-interest-calculator', 'finance-tools', 'Simulate long-term wealth growth with recurring monthly contributions and flexible compounding frequencies.', 'Simulate long-term wealth growth with recurring monthly contributions and flexible compounding frequencies.', 'TrendingUp', ARRAY['compound interest calculator', 'investment calculator', 'compound growth', 'future value', 'savings calculator']::text[], true, true, false, '["Enter initial starting deposit.","Input monthly or annual recurring contribution.","Set expected annual interest rate (e.g. 7% for index funds).","Select compounding frequency (Daily, Monthly, Quarterly, Annually).","Choose investment horizon in years to see projected future portfolio balance."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['investment-calculator', 'simple-interest-calculator', 'loan-calculator']::text[], 'financial'),
('time-calculator', 'Time Calculator', 'time-calculator', 'date-time', 'Add, subtract, and calculate duration differences between hours, minutes, and seconds.', 'Add, subtract, and calculate duration differences between hours, minutes, and seconds.', 'Clock', ARRAY['time calculator', 'add hours minutes', 'time difference calculator', 'hours between times', 'duration calculator']::text[], false, false, false, '["Select mode: Add/Subtract times or Calculate Difference between Start & End times.","Enter hours, minutes, and seconds.","View total accumulated hours, minutes, decimal hours (for timesheets), and total seconds."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['date-calculator', 'meeting-time-calculator', 'stopwatch']::text[], 'general'),
('date-calculator', 'Date Calculator', 'date-calculator', 'date-time', 'Add or subtract days, weeks, months, and years from any date, or find total days between two dates.', 'Add or subtract days, weeks, months, and years from any date, or find total days between two dates.', 'Calendar', ARRAY['date calculator', 'days between dates', 'add days to date', 'business days calculator', 'date duration']::text[], false, false, false, '["Choose \"Days Between Two Dates\" or \"Add/Subtract from Date\".","Select start date and target end date.","Toggle option to include/exclude end date or calculate working business days (Mon-Fri)."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['age-calculator', 'time-calculator', 'countdown-timer']::text[], 'general'),
('unit-converter', 'Unit Converter', 'unit-converter', 'converters', 'Universal unit conversion tool for length, mass, temperature, area, volume, speed, pressure, and energy.', 'Universal unit conversion tool for length, mass, temperature, area, volume, speed, pressure, and energy.', 'ArrowLeftRight', ARRAY['unit converter', 'convert units', 'metric to imperial', 'measurement converter', 'universal converter']::text[], true, true, false, '["Select the measurement dimension (Length, Weight, Temp, Area, Volume, Speed, Data, Pressure).","Input the source value.","Choose your source unit and destination unit.","Get instant converted value with full precision and reference conversion factors."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['length-converter', 'weight-converter', 'temperature-converter']::text[], 'general'),
('length-converter', 'Length Converter', 'length-converter', 'converters', 'Convert between meters, kilometers, centimeters, millimeters, miles, yards, feet, inches, and nautical miles.', 'Convert between meters, kilometers, centimeters, millimeters, miles, yards, feet, inches, and nautical miles.', 'Ruler', ARRAY['length converter', 'meters to feet', 'inches to cm', 'miles to km', 'yards to meters']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['unit-converter', 'area-converter', 'speed-converter']::text[], 'general'),
('weight-converter', 'Weight Converter', 'weight-converter', 'converters', 'Convert kilograms, grams, milligrams, pounds, ounces, stones, and metric tons.', 'Convert kilograms, grams, milligrams, pounds, ounces, stones, and metric tons.', 'Scale', ARRAY['weight converter', 'kg to lbs', 'pounds to kg', 'grams to ounces', 'mass converter']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['unit-converter', 'bmi-calculator', 'ideal-weight-calculator']::text[], 'general'),
('temperature-converter', 'Temperature Converter', 'temperature-converter', 'converters', 'Convert temperatures between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R) with step formulas.', 'Convert temperatures between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R) with step formulas.', 'Thermometer', ARRAY['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['unit-converter', 'speed-converter']::text[], 'general'),
('area-converter', 'Area Converter', 'area-converter', 'converters', 'Convert square meters, square feet, acres, hectares, square kilometers, and square miles.', 'Convert square meters, square feet, acres, hectares, square kilometers, and square miles.', 'Maximize2', ARRAY['area converter', 'acres to sq ft', 'hectares to acres', 'sq meters to sq feet']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['length-converter', 'volume-converter']::text[], 'general'),
('volume-converter', 'Volume Converter', 'volume-converter', 'converters', 'Convert liters, milliliters, US gallons, fluid ounces, cups, pints, quarts, and cubic meters.', 'Convert liters, milliliters, US gallons, fluid ounces, cups, pints, quarts, and cubic meters.', 'Box', ARRAY['volume converter', 'liters to gallons', 'gallons to liters', 'cups to ml', 'fluid ounces to ml']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['unit-converter', 'water-intake-calculator']::text[], 'general'),
('speed-converter', 'Speed Converter', 'speed-converter', 'converters', 'Convert between km/h, mph, m/s, knots, and feet per second.', 'Convert between km/h, mph, m/s, knots, and feet per second.', 'Gauge', ARRAY['speed converter', 'kmh to mph', 'mph to kmh', 'knots to mph', 'pace converter']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['pace-calculator', 'unit-converter']::text[], 'general'),
('data-storage-converter', 'Data Storage Converter', 'data-storage-converter', 'converters', 'Convert digital storage sizes between Bits, Bytes, KB, MB, GB, TB, PB, KiB, MiB, and GiB.', 'Convert digital storage sizes between Bits, Bytes, KB, MB, GB, TB, PB, KiB, MiB, and GiB.', 'HardDrive', ARRAY['data storage converter', 'mb to gb', 'gb to tb', 'bytes to kb', 'binary data converter']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['file-size-converter', 'unit-converter']::text[], 'general'),
('time-zone-converter', 'Time Zone Converter', 'time-zone-converter', 'date-time', 'Compare and convert times between world time zones (UTC, EST, PST, GMT, CET, IST, JST, AEST).', 'Compare and convert times between world time zones (UTC, EST, PST, GMT, CET, IST, JST, AEST).', 'Globe', ARRAY['time zone converter', 'utc to est', 'world clock converter', 'gmt to ist', 'time difference world']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['meeting-time-calculator', 'time-calculator']::text[], 'general'),
('currency-converter', 'Currency Converter', 'currency-converter', 'converters', 'Convert world currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, INR, CNY, AED, SGD, BRL) with extensible rate feeds.', 'Convert world currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, INR, CNY, AED, SGD, BRL) with extensible rate feeds.', 'Coins', ARRAY['currency converter', 'usd to eur', 'gbp to usd', 'exchange rates', 'money converter']::text[], true, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['salary-calculator', 'gst-calculator', 'discount-calculator']::text[], 'financial'),
('word-counter', 'Word Counter', 'word-counter', 'text-tools', 'Count words, characters, sentences, paragraphs, reading time, speaking time, and top keyword frequencies.', 'Comprehensive live text statistics analyzer. Instant count of words, characters with/without whitespace, sentences, paragraphs, estimated reading/speaking duration, and keyword density matrix.', 'FileText', ARRAY['word counter', 'character counter', 'word count tool', 'reading time calculator', 'text analyzer']::text[], true, true, false, '["Type or paste your text into the editor.","Review instant stats: words, characters, sentences, paragraphs, and reading time.","Examine the top keyword frequency table to optimize content readability."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['character-counter', 'sentence-counter', 'case-converter']::text[], 'general'),
('character-counter', 'Character Counter', 'character-counter', 'text-tools', 'Count characters and monitor social media character limits (X/Twitter, Instagram, LinkedIn, SEO Title, Meta Desc).', 'Count characters and monitor social media character limits (X/Twitter, Instagram, LinkedIn, SEO Title, Meta Desc).', 'SpellCheck', ARRAY['character counter', 'letter count', 'twitter character count', 'meta description length', 'sms length counter']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['word-counter', 'meta-description-generator']::text[], 'general'),
('sentence-counter', 'Sentence Counter', 'sentence-counter', 'text-tools', 'Count sentences, compute average words per sentence, and analyze text flow complexity.', 'Count sentences, compute average words per sentence, and analyze text flow complexity.', 'AlignLeft', ARRAY['sentence counter', 'count sentences', 'readability analyzer', 'average sentence length']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['word-counter', 'lorem-ipsum-generator']::text[], 'general'),
('case-converter', 'Case Converter', 'case-converter', 'text-tools', 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase, and Sentence case.', 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase, and Sentence case.', 'Type', ARRAY['case converter', 'title case converter', 'uppercase to lowercase', 'camelcase generator', 'snake case']::text[], false, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['slug-generator', 'text-reverser', 'word-counter']::text[], 'general'),
('remove-duplicate-lines', 'Remove Duplicate Lines', 'remove-duplicate-lines', 'text-tools', 'Remove duplicate lines from lists or text documents with case-sensitive and whitespace trim options.', 'Remove duplicate lines from lists or text documents with case-sensitive and whitespace trim options.', 'CopyX', ARRAY['remove duplicate lines', 'deduplicate list', 'unique lines filter', 'clean list']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['text-sorter', 'remove-extra-spaces']::text[], 'general'),
('remove-extra-spaces', 'Remove Extra Spaces', 'remove-extra-spaces', 'text-tools', 'Clean up text by removing consecutive spaces, trimming trailing whitespace, and collapsing extra blank lines.', 'Clean up text by removing consecutive spaces, trimming trailing whitespace, and collapsing extra blank lines.', 'Eraser', ARRAY['remove extra spaces', 'clean text', 'trim whitespace', 'collapse spaces']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['remove-duplicate-lines', 'case-converter']::text[], 'general'),
('text-reverser', 'Text Reverser', 'text-reverser', 'text-tools', 'Reverse text characters, reverse word order, reverse each word individually, or generate upside-down text.', 'Reverse text characters, reverse word order, reverse each word individually, or generate upside-down text.', 'FlipHorizontal', ARRAY['text reverser', 'reverse words', 'backwards text generator', 'mirror text']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['case-converter', 'text-sorter']::text[], 'general'),
('text-sorter', 'Text Sorter', 'text-sorter', 'text-tools', 'Sort lists alphabetically (A-Z, Z-A), numerically, by line length, or in random shuffled order.', 'Sort lists alphabetically (A-Z, Z-A), numerically, by line length, or in random shuffled order.', 'ArrowUpDown', ARRAY['text sorter', 'alphabetize list', 'sort lines a-z', 'randomize list', 'list sorter']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['remove-duplicate-lines', 'random-decision-maker']::text[], 'general'),
('slug-generator', 'Slug Generator', 'slug-generator', 'text-tools', 'Convert article titles and strings into clean, SEO-friendly URL slugs with custom separators.', 'Convert article titles and strings into clean, SEO-friendly URL slugs with custom separators.', 'Link', ARRAY['slug generator', 'url slug creator', 'seo friendly url', 'string to slug']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['case-converter', 'meta-tag-generator', 'canonical-url-generator']::text[], 'general'),
('lorem-ipsum-generator', 'Lorem Ipsum Generator', 'lorem-ipsum-generator', 'text-tools', 'Generate placeholder dummy text by paragraphs, sentences, words, or unordered bullet lists.', 'Generate placeholder dummy text by paragraphs, sentences, words, or unordered bullet lists.', 'Pilcrow', ARRAY['lorem ipsum generator', 'placeholder text', 'dummy text', 'lipsum generator']::text[], false, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['word-counter', 'sentence-counter']::text[], 'general'),
('json-formatter', 'JSON Formatter & Validator', 'json-formatter', 'developer-tools', 'Prettify, format, minify, validate, and inspect JSON with collapsible hierarchy tree view and copy/download.', 'Fast, secure in-browser JSON Formatter and Validator. Formats raw JSON with 2-space or 4-space indentation, minifies for production, highlights syntax errors with exact line/column indicators, and processes everything locally.', 'Braces', ARRAY['json formatter', 'json validator', 'beautify json', 'minify json', 'json parser', 'json tree view']::text[], true, true, false, '["Paste your raw JSON string or upload a .json file.","Click \"Format / Prettify\" (2 spaces / 4 spaces) or \"Minify\".","Review interactive tree view or formatted output.","Copy to clipboard or download as formatted .json."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['json-validator', 'base64-encoder', 'uuid-generator']::text[], 'general'),
('json-validator', 'JSON Validator', 'json-validator', 'developer-tools', 'Validate JSON syntax in real time with line and character error markers, and fix common trailing commas.', 'Validate JSON syntax in real time with line and character error markers, and fix common trailing commas.', 'CheckCircle2', ARRAY['json validator', 'validate json', 'json syntax check', 'fix json errors']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['json-formatter', 'base64-decoder']::text[], 'general'),
('base64-encoder', 'Base64 Encoder', 'base64-encoder', 'developer-tools', 'Encode plain text, UTF-8 strings, and local binary files into standard Base64 representation.', 'Encode plain text, UTF-8 strings, and local binary files into standard Base64 representation.', 'Binary', ARRAY['base64 encoder', 'encode base64', 'string to base64', 'utf8 base64']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['base64-decoder', 'image-to-base64', 'url-encoder']::text[], 'general'),
('base64-decoder', 'Base64 Decoder', 'base64-decoder', 'developer-tools', 'Decode Base64 encoded strings back into clean UTF-8 text or preview decoded image assets.', 'Decode Base64 encoded strings back into clean UTF-8 text or preview decoded image assets.', 'Code', ARRAY['base64 decoder', 'decode base64', 'base64 to text', 'base64 converter']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['base64-encoder', 'base64-to-image', 'html-entity-decoder']::text[], 'general'),
('url-encoder', 'URL Encoder / Decoder', 'url-encoder', 'developer-tools', 'Encode and decode query strings and URLs using standard percent-encoding (encodeURIComponent & encodeURI).', 'Encode and decode query strings and URLs using standard percent-encoding (encodeURIComponent & encodeURI).', 'Link2', ARRAY['url encoder', 'url decoder', 'percent encoding', 'uri component encoder', 'url escape']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['html-entity-encoder', 'slug-generator']::text[], 'general'),
('html-entity-encoder', 'HTML Entity Encoder / Decoder', 'html-entity-encoder', 'developer-tools', 'Convert special characters into HTML entities (e.g. & to &amp;, < to &lt;) and decode entities back to text.', 'Convert special characters into HTML entities (e.g. & to &amp;, < to &lt;) and decode entities back to text.', 'FileCode', ARRAY['html entity encoder', 'html decode', 'escape html', 'html special chars']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['url-encoder', 'base64-encoder']::text[], 'general'),
('uuid-generator', 'UUID / GUID Generator', 'uuid-generator', 'developer-tools', 'Generate cryptographically secure Version 4 UUIDs (GUIDs) in bulk with uppercase, lowercase, and hyphens options.', 'Generate cryptographically secure Version 4 UUIDs (GUIDs) in bulk with uppercase, lowercase, and hyphens options.', 'Key', ARRAY['uuid generator', 'guid generator', 'uuid v4', 'bulk uuid generator', 'random uuid']::text[], true, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['hash-generator', 'password-generator', 'json-formatter']::text[], 'general'),
('hash-generator', 'Hash Generator', 'hash-generator', 'developer-tools', 'Generate cryptographic hashes using client-side Web Crypto API (SHA-256, SHA-512, SHA-384, SHA-1, MD5).', 'Generate cryptographic hashes using client-side Web Crypto API (SHA-256, SHA-512, SHA-384, SHA-1, MD5).', 'ShieldCheck', ARRAY['hash generator', 'sha256 generator', 'sha512 generator', 'md5 hash', 'crypto hash online']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['uuid-generator', 'password-generator', 'base64-encoder']::text[], 'general'),
('meta-tag-generator', 'Meta Tag Generator', 'meta-tag-generator', 'seo-tools', 'Generate comprehensive HTML meta tags including Title, Description, Robots, Canonical, and Open Graph.', 'Generate comprehensive HTML meta tags including Title, Description, Robots, Canonical, and Open Graph.', 'SearchCheck', ARRAY['meta tag generator', 'seo meta tags', 'html meta generator', 'meta tags creator']::text[], true, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['meta-description-generator', 'open-graph-generator', 'serp-snippet-preview']::text[], 'general'),
('meta-description-generator', 'Meta Description Generator', 'meta-description-generator', 'seo-tools', 'Craft high-CTR meta descriptions with real-time character count (150-160 max) and pixel width meter.', 'Craft high-CTR meta descriptions with real-time character count (150-160 max) and pixel width meter.', 'FileSearch', ARRAY['meta description generator', 'meta description length', 'seo snippet description', 'meta tag tool']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['meta-tag-generator', 'serp-snippet-preview']::text[], 'general'),
('robots-txt-generator', 'Robots.txt Generator', 'robots-txt-generator', 'seo-tools', 'Create custom robots.txt files with crawl rules for Googlebot, Bingbot, sitemap references, and crawl delays.', 'Create custom robots.txt files with crawl rules for Googlebot, Bingbot, sitemap references, and crawl delays.', 'Bot', ARRAY['robots txt generator', 'create robots txt', 'robots file creator', 'seo crawler rules']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['sitemap-generator', 'meta-tag-generator']::text[], 'general'),
('sitemap-generator', 'XML Sitemap Generator', 'sitemap-generator', 'seo-tools', 'Build Google-compliant XML sitemaps with page URLs, priority values, and change frequencies ready to download.', 'Build Google-compliant XML sitemaps with page URLs, priority values, and change frequencies ready to download.', 'Network', ARRAY['xml sitemap generator', 'create sitemap xml', 'google sitemap creator', 'seo sitemap']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['robots-txt-generator', 'canonical-url-generator']::text[], 'general'),
('open-graph-generator', 'Open Graph Meta Tag Generator', 'open-graph-generator', 'seo-tools', 'Generate social meta tags for Facebook, LinkedIn, Twitter/X cards with real-time live preview mockups.', 'Generate social meta tags for Facebook, LinkedIn, Twitter/X cards with real-time live preview mockups.', 'Share2', ARRAY['open graph generator', 'og meta tags', 'twitter card generator', 'social share preview']::text[], false, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['meta-tag-generator', 'serp-snippet-preview']::text[], 'general'),
('keyword-density-checker', 'Keyword Density Checker', 'keyword-density-checker', 'seo-tools', 'Analyze keyword density percentages for 1-word, 2-word, and 3-word phrases to avoid keyword stuffing.', 'Analyze keyword density percentages for 1-word, 2-word, and 3-word phrases to avoid keyword stuffing.', 'BarChart2', ARRAY['keyword density checker', 'keyword frequency analyzer', 'seo content optimization', 'keyword density tool']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['word-counter', 'meta-tag-generator']::text[], 'general'),
('serp-snippet-preview', 'SERP Snippet Preview Tool', 'serp-snippet-preview', 'seo-tools', 'Preview exactly how your page Title, URL, and Meta Description will look in Google Desktop & Mobile search results.', 'Preview exactly how your page Title, URL, and Meta Description will look in Google Desktop & Mobile search results.', 'Monitor', ARRAY['serp snippet preview', 'google search preview', 'seo title preview', 'google snippet optimizer']::text[], true, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['meta-tag-generator', 'meta-description-generator', 'open-graph-generator']::text[], 'general'),
('canonical-url-generator', 'Canonical URL Generator', 'canonical-url-generator', 'seo-tools', 'Generate clean rel="canonical" tags to prevent duplicate content penalties across protocol and trailing slashes.', 'Generate clean rel="canonical" tags to prevent duplicate content penalties across protocol and trailing slashes.', 'Link', ARRAY['canonical url generator', 'rel canonical tag', 'duplicate content seo', 'canonical link tag']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['slug-generator', 'meta-tag-generator']::text[], 'general'),
('schema-markup-generator', 'Schema Markup Generator (JSON-LD)', 'schema-markup-generator', 'seo-tools', 'Generate structured data JSON-LD for Articles, FAQs, Organizations, Local Businesses, and Products.', 'Generate structured data JSON-LD for Articles, FAQs, Organizations, Local Businesses, and Products.', 'Cpu', ARRAY['schema markup generator', 'json ld generator', 'structured data tool', 'faq schema creator']::text[], false, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['meta-tag-generator', 'sitemap-generator']::text[], 'general'),
('password-generator', 'Password Generator', 'password-generator', 'generators', 'Generate ultra-secure, cryptographically strong random passwords with custom symbols, numbers, and entropy rating.', 'Create unbreakable passwords using the browser’s native crypto.getRandomValues API. Customize length, uppercase/lowercase characters, numbers, custom symbols, exclude ambiguous characters (l, 1, O, 0), and measure password strength in real time.', 'Shield', ARRAY['password generator', 'random password generator', 'strong password', 'secure password creator', 'entropy checker']::text[], true, true, false, '["Select password length (8 to 64 characters).","Toggle character groups: Uppercase (A-Z), Lowercase (a-z), Numbers (0-9), Symbols (!@#$%).","Click \"Generate Password\" or use the auto-refresh button.","Click \"Copy\" to safely store in your password manager."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['uuid-generator', 'hash-generator']::text[], 'general'),
('random-number-generator', 'Random Number Generator', 'random-number-generator', 'generators', 'Generate random numbers or bulk integers within any custom range (min, max) with duplicate controls.', 'Generate random numbers or bulk integers within any custom range (min, max) with duplicate controls.', 'Dice5', ARRAY['random number generator', 'rng', 'random integer', 'lottery number picker', 'dice roller']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['random-decision-maker', 'password-generator']::text[], 'general'),
('random-name-generator', 'Random Name Generator', 'random-name-generator', 'generators', 'Generate realistic first and last names across diverse cultural backgrounds and gender options.', 'Generate realistic first and last names across diverse cultural backgrounds and gender options.', 'UserCheck', ARRAY['random name generator', 'fake name generator', 'character name generator', 'random person name']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['username-generator', 'lorem-ipsum-generator']::text[], 'general'),
('username-generator', 'Username Generator', 'username-generator', 'generators', 'Create unique, stylish usernames for social media, YouTube, Discord, gaming tags, and professional accounts.', 'Create unique, stylish usernames for social media, YouTube, Discord, gaming tags, and professional accounts.', 'AtSign', ARRAY['username generator', 'gamer tag generator', 'social media handle creator', 'cool usernames']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['random-name-generator', 'password-generator']::text[], 'general'),
('qr-code-generator', 'QR Code Generator', 'qr-code-generator', 'generators', 'Generate customizable, high-resolution QR codes for URLs, WiFi networks, text, contact cards, and email with PNG download.', 'Create instant QR codes entirely in your browser with custom styling (dark luxury, classic, gold accents), error correction levels (L, M, Q, H), and high-res PNG/SVG download support.', 'QrCode', ARRAY['qr code generator', 'free qr code maker', 'custom qr code', 'wifi qr code', 'download qr code']::text[], true, true, false, '["Enter URL, plain text, WiFi credentials, or email.","Pick color themes (Classic Black, Deep Navy & Gold, Emerald, Sunset).","Select resolution / size (256px to 1024px).","Click \"Download QR Code PNG\"."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['url-encoder', 'slug-generator']::text[], 'general'),
('color-palette-generator', 'Color Palette Generator', 'color-palette-generator', 'generators', 'Generate harmonious 5-color aesthetic palettes (Monochromatic, Analogous, Complementary, Triadic) with HEX/RGB/Tailwind export.', 'Generate harmonious 5-color aesthetic palettes (Monochromatic, Analogous, Complementary, Triadic) with HEX/RGB/Tailwind export.', 'Palette', ARRAY['color palette generator', 'color scheme creator', 'hex color picker', 'harmonious color palette', 'tailwind colors']::text[], true, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['gradient-generator', 'base64-encoder']::text[], 'general'),
('gradient-generator', 'CSS Gradient Generator', 'gradient-generator', 'generators', 'Build modern linear and radial CSS background gradients with interactive color stops and 1-click CSS export.', 'Build modern linear and radial CSS background gradients with interactive color stops and 1-click CSS export.', 'Sparkles', ARRAY['css gradient generator', 'linear gradient maker', 'radial gradient', 'web gradient generator']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['color-palette-generator', 'qr-code-generator']::text[], 'general'),
('image-compressor', 'Image Compressor', 'image-compressor', 'image-tools', 'Compress JPG, PNG, and WebP images locally in your browser with real-time file size savings comparison.', 'Reduce image file size by up to 80% without visible quality loss. Runs 100% client-side via HTML5 Canvas with zero server uploads for complete data privacy.', 'Minimize', ARRAY['image compressor', 'compress jpg', 'compress png', 'reduce image file size', 'online image compression']::text[], true, true, false, '["Drag and drop an image file (JPG, PNG, WebP) or click to browse.","Adjust the Quality compression slider (1% to 100%).","Compare the Original vs Compressed file size and visual preview.","Download your optimized compressed image instantly."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['image-resizer', 'jpg-to-png', 'png-to-jpg']::text[], 'general'),
('image-resizer', 'Image Resizer', 'image-resizer', 'image-tools', 'Resize image dimensions by exact pixels (width/height) or percentage scaling with aspect ratio locking.', 'Resize image dimensions by exact pixels (width/height) or percentage scaling with aspect ratio locking.', 'Crop', ARRAY['image resizer', 'resize picture', 'change image dimensions', 'scale photo online']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['image-compressor', 'image-cropper']::text[], 'general'),
('image-cropper', 'Image Cropper', 'image-cropper', 'image-tools', 'Crop images with preset aspect ratios (1:1 Square, 16:9 Landscape, 4:3, 9:16 Story) or freeform selection.', 'Crop images with preset aspect ratios (1:1 Square, 16:9 Landscape, 4:3, 9:16 Story) or freeform selection.', 'Scissors', ARRAY['image cropper', 'crop photo online', 'aspect ratio crop', 'square photo crop']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['image-resizer', 'image-compressor']::text[], 'general'),
('jpg-to-png', 'JPG to PNG Converter', 'jpg-to-png', 'image-tools', 'Convert JPG / JPEG photos into lossless PNG format directly in your browser with zero quality degradation.', 'Convert JPG / JPEG photos into lossless PNG format directly in your browser with zero quality degradation.', 'ImagePlus', ARRAY['jpg to png', 'convert jpg to png', 'jpeg to png online', 'lossless png converter']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['png-to-jpg', 'image-format-converter']::text[], 'general'),
('png-to-jpg', 'PNG to JPG Converter', 'png-to-jpg', 'image-tools', 'Convert PNG images with transparent backgrounds to high-quality JPG with custom background fill color.', 'Convert PNG images with transparent backgrounds to high-quality JPG with custom background fill color.', 'Image', ARRAY['png to jpg', 'convert png to jpg', 'png to jpeg online']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['jpg-to-png', 'image-compressor']::text[], 'general'),
('image-format-converter', 'Image Format Converter', 'image-format-converter', 'image-tools', 'Convert any image between WebP, PNG, JPG, and BMP formats with quality adjustments.', 'Convert any image between WebP, PNG, JPG, and BMP formats with quality adjustments.', 'Layers', ARRAY['image format converter', 'webp to png', 'png to webp', 'convert photo format']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['image-compressor', 'jpg-to-png']::text[], 'general'),
('image-to-base64', 'Image to Base64 Converter', 'image-to-base64', 'image-tools', 'Convert image files into Base64 Data URIs ready to embed in HTML <img> tags or CSS background-image.', 'Convert image files into Base64 Data URIs ready to embed in HTML <img> tags or CSS background-image.', 'Code2', ARRAY['image to base64', 'base64 image converter', 'data uri image', 'embed image base64']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['base64-to-image', 'base64-encoder']::text[], 'general'),
('base64-to-image', 'Base64 to Image Decoder', 'base64-to-image', 'image-tools', 'Decode Base64 Data URI strings into downloadable image files (PNG, JPG, WebP) with instant visual preview.', 'Decode Base64 Data URI strings into downloadable image files (PNG, JPG, WebP) with instant visual preview.', 'Eye', ARRAY['base64 to image', 'decode base64 image', 'base64 string to picture']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['image-to-base64', 'base64-decoder']::text[], 'general'),
('pomodoro-timer', 'Pomodoro Focus Timer', 'pomodoro-timer', 'productivity', 'Boost focus and productivity with customizable Pomodoro intervals (25m Focus, 5m Short Break, 15m Long Break) and audio chimes.', 'Scientifically proven Pomodoro technique timer. Manage deep work cycles, track completed sessions, toggle audio alerts, and customize interval lengths.', 'Timer', ARRAY['pomodoro timer', 'focus timer', 'productivity timer', 'pomodoro technique', 'study timer']::text[], true, true, false, '["Select cycle: Focus (25m), Short Break (5m), or Long Break (15m).","Click \"Start\" to begin the countdown timer.","Receive a clean audio notification and visual alert when the interval completes."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['countdown-timer', 'stopwatch', 'daily-habit-tracker']::text[], 'general'),
('countdown-timer', 'Countdown Timer', 'countdown-timer', 'productivity', 'Set custom countdown timers with hours, minutes, seconds, audible alarm, pause/resume, and full-screen view.', 'Set custom countdown timers with hours, minutes, seconds, audible alarm, pause/resume, and full-screen view.', 'Hourglass', ARRAY['countdown timer', 'online timer', 'set timer', 'kitchen timer', 'alarm timer']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['pomodoro-timer', 'stopwatch']::text[], 'general'),
('stopwatch', 'Online Stopwatch', 'stopwatch', 'productivity', 'Precision digital stopwatch with millisecond accuracy, lap tracking, split intervals, and lap table export.', 'Precision digital stopwatch with millisecond accuracy, lap tracking, split intervals, and lap table export.', 'Watch', ARRAY['stopwatch', 'online stopwatch', 'lap timer', 'precision timer', 'split timer']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['countdown-timer', 'pomodoro-timer', 'pace-calculator']::text[], 'general'),
('daily-habit-tracker', 'Daily Habit Tracker', 'daily-habit-tracker', 'productivity', 'Track daily habits, maintain consecutive streaks, and monitor visual progress rings stored in your browser.', 'Track daily habits, maintain consecutive streaks, and monitor visual progress rings stored in your browser.', 'CheckSquare', ARRAY['habit tracker', 'daily habits', 'streak tracker', 'habit builder', 'routine checklist']::text[], false, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['todo-list', 'notes-tool', 'pomodoro-timer']::text[], 'general'),
('random-decision-maker', 'Random Decision Maker', 'random-decision-maker', 'productivity', 'Overcome decision fatigue with an animated choice picker wheel for lunch, choices, or giveaway winners.', 'Overcome decision fatigue with an animated choice picker wheel for lunch, choices, or giveaway winners.', 'HelpCircle', ARRAY['decision maker', 'wheel of names', 'random picker', 'choice spinner', 'random selector']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['random-number-generator', 'random-name-generator']::text[], 'general'),
('todo-list', 'To-Do List', 'todo-list', 'productivity', 'Minimalist task manager with priority flags, task categories, completion filters, and local persistence.', 'Minimalist task manager with priority flags, task categories, completion filters, and local persistence.', 'ListChecks', ARRAY['to do list', 'task manager', 'task checklist', 'daily planner', 'todo app online']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['daily-habit-tracker', 'notes-tool']::text[], 'general'),
('notes-tool', 'Notes Scratchpad', 'notes-tool', 'productivity', 'Distraction-free rich scratchpad with live word count, local auto-save, and instant Markdown / text export.', 'Distraction-free rich scratchpad with live word count, local auto-save, and instant Markdown / text export.', 'StickyNote', ARRAY['notes tool', 'scratchpad', 'notepad online', 'quick notes', 'auto save text editor']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['todo-list', 'word-counter']::text[], 'general'),
('meeting-time-calculator', 'Meeting Time Calculator', 'meeting-time-calculator', 'date-time', 'Find overlapping working hour slots across international team timezones (EST, PST, GMT, CET, IST, JST).', 'Find overlapping working hour slots across international team timezones (EST, PST, GMT, CET, IST, JST).', 'Users', ARRAY['meeting time calculator', 'world clock meeting planner', 'time zone overlap', 'remote team time finder']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['time-zone-converter', 'time-calculator']::text[], 'general'),
('salary-calculator', 'Salary & Hourly Wage Calculator', 'salary-calculator', 'finance-tools', 'Convert between hourly wage, daily, weekly, bi-weekly, monthly, and annual gross salary with working hour adjustments.', 'Convert between hourly wage, daily, weekly, bi-weekly, monthly, and annual gross salary with working hour adjustments.', 'DollarSign', ARRAY['salary calculator', 'hourly to salary', 'annual income calculator', 'wage converter', 'paycheck calculator']::text[], true, true, false, '["Enter compensation amount and select time basis (Hourly, Weekly, Monthly, Annual).","Adjust standard working hours per week (default 40 hrs) and paid weeks per year (default 52).","View comprehensive salary breakdown across hourly, daily, weekly, monthly, and annual figures."]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['tax-calculator', 'loan-calculator', 'profit-margin-calculator']::text[], 'financial'),
('simple-interest-calculator', 'Simple Interest Calculator', 'simple-interest-calculator', 'finance-tools', 'Calculate simple interest (I = P × r × t), total accrued amount, and interest earned over time.', 'Calculate simple interest (I = P × r × t), total accrued amount, and interest earned over time.', 'Percent', ARRAY['simple interest calculator', 'interest formula', 'calculate interest', 'simple interest equation']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['compound-interest-calculator', 'loan-calculator']::text[], 'financial'),
('mortgage-calculator', 'Mortgage Calculator', 'mortgage-calculator', 'finance-tools', 'Calculate monthly home mortgage payment with property tax, home insurance, PMI, and total loan cost.', 'Calculate monthly home mortgage payment with property tax, home insurance, PMI, and total loan cost.', 'Home', ARRAY['mortgage calculator', 'home loan calculator', 'monthly mortgage payment', 'property tax calculator', 'house payment']::text[], true, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['loan-calculator', 'compound-interest-calculator', 'roi-calculator']::text[], 'financial'),
('investment-calculator', 'Investment Return Calculator', 'investment-calculator', 'finance-tools', 'Project future investment portfolio returns, annual contributions, and compound stock market growth over 10 to 40 years.', 'Project future investment portfolio returns, annual contributions, and compound stock market growth over 10 to 40 years.', 'LineChart', ARRAY['investment calculator', 'stock return calculator', 'portfolio growth', 'future value investments', '401k calculator']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['compound-interest-calculator', 'roi-calculator', 'salary-calculator']::text[], 'financial'),
('profit-margin-calculator', 'Profit Margin & Markup Calculator', 'profit-margin-calculator', 'finance-tools', 'Calculate gross profit margin percentage, markup percentage, cost of goods, and total net profit.', 'Calculate gross profit margin percentage, markup percentage, cost of goods, and total net profit.', 'Briefcase', ARRAY['profit margin calculator', 'gross margin', 'markup calculator', 'cost and sell price', 'profit percentage']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['discount-calculator', 'roi-calculator', 'gst-calculator']::text[], 'financial'),
('roi-calculator', 'ROI (Return on Investment) Calculator', 'roi-calculator', 'finance-tools', 'Calculate total percentage Return on Investment (ROI) and annualized ROI for business ventures or assets.', 'Calculate total percentage Return on Investment (ROI) and annualized ROI for business ventures or assets.', 'TrendingUp', ARRAY['roi calculator', 'return on investment', 'annualized roi', 'investment performance']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['profit-margin-calculator', 'investment-calculator']::text[], 'financial'),
('tax-calculator', 'Income Tax Estimator', 'tax-calculator', 'finance-tools', 'Estimate progressive income tax brackets, effective tax rate, and take-home net income.', 'Estimate progressive income tax brackets, effective tax rate, and take-home net income.', 'FileText', ARRAY['tax calculator', 'income tax estimate', 'effective tax rate', 'after tax salary']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['salary-calculator', 'gst-calculator']::text[], 'financial'),
('bmr-calculator', 'BMR Calculator (Basal Metabolic Rate)', 'bmr-calculator', 'health', 'Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor & Harris-Benedict formulas to find calories burned at rest.', 'Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor & Harris-Benedict formulas to find calories burned at rest.', 'Activity', ARRAY['bmr calculator', 'basal metabolic rate', 'calories burned at rest', 'mifflin st jeor formula']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['tdee-calculator', 'calorie-calculator', 'bmi-calculator']::text[], 'health'),
('tdee-calculator', 'TDEE Calculator (Total Daily Energy Expenditure)', 'tdee-calculator', 'health', 'Calculate Total Daily Energy Expenditure (TDEE) based on activity level and get personalized calorie deficit/surplus goals.', 'Calculate Total Daily Energy Expenditure (TDEE) based on activity level and get personalized calorie deficit/surplus goals.', 'Flame', ARRAY['tdee calculator', 'total daily energy expenditure', 'maintenance calories', 'calorie deficit calculator']::text[], true, true, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['calorie-calculator', 'bmr-calculator', 'body-fat-calculator']::text[], 'health'),
('calorie-calculator', 'Calorie Target & Macro Calculator', 'calorie-calculator', 'health', 'Determine exact daily calorie targets for weight loss, maintenance, or muscle gain with balanced macronutrient breakdowns.', 'Determine exact daily calorie targets for weight loss, maintenance, or muscle gain with balanced macronutrient breakdowns.', 'Apple', ARRAY['calorie calculator', 'macro calculator', 'weight loss calories', 'daily calorie needs', 'protein carbs fat macros']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['tdee-calculator', 'ideal-weight-calculator', 'water-intake-calculator']::text[], 'health'),
('ideal-weight-calculator', 'Ideal Body Weight Calculator', 'ideal-weight-calculator', 'health', 'Compare ideal body weight estimates across medical formulas: Devine, Robinson, Miller, and Hamwi equations.', 'Compare ideal body weight estimates across medical formulas: Devine, Robinson, Miller, and Hamwi equations.', 'Scale', ARRAY['ideal weight calculator', 'healthy weight by height', 'devine formula', 'target weight']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['bmi-calculator', 'body-fat-calculator']::text[], 'health'),
('body-fat-calculator', 'Body Fat Percentage Calculator', 'body-fat-calculator', 'health', 'Estimate body fat percentage using the U.S. Navy circumference method with neck, waist, and hip measurements.', 'Estimate body fat percentage using the U.S. Navy circumference method with neck, waist, and hip measurements.', 'Target', ARRAY['body fat calculator', 'navy body fat formula', 'body fat percentage', 'lean mass calculator']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['bmi-calculator', 'tdee-calculator']::text[], 'health'),
('water-intake-calculator', 'Daily Water Intake Calculator', 'water-intake-calculator', 'health', 'Calculate recommended daily water hydration in liters and ounces based on body weight, exercise, and climate.', 'Calculate recommended daily water hydration in liters and ounces based on body weight, exercise, and climate.', 'Droplet', ARRAY['water intake calculator', 'daily water needs', 'how much water to drink', 'hydration calculator']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['calorie-calculator', 'pace-calculator']::text[], 'health'),
('pace-calculator', 'Running & Cycling Pace Calculator', 'pace-calculator', 'health', 'Calculate running pace per km/mile, split times, and target race finishes for 5K, 10K, Half Marathon, and Full Marathon.', 'Calculate running pace per km/mile, split times, and target race finishes for 5K, 10K, Half Marathon, and Full Marathon.', 'Footprints', ARRAY['pace calculator', 'running pace', '5k pace', 'marathon finish time calculator', 'pace per km to per mile']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['speed-converter', 'stopwatch', 'water-intake-calculator']::text[], 'general'),
('file-size-converter', 'File Size Converter', 'file-size-converter', 'file-tools', 'Convert file sizes between Bytes, KB, MB, GB, and TB in decimal (1000) and binary (1024) formats.', 'Convert file sizes between Bytes, KB, MB, GB, and TB in decimal (1000) and binary (1024) formats.', 'File', ARRAY['file size converter', 'bytes to mb', 'mb to gb', 'file size calculator']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['data-storage-converter', 'unit-converter']::text[], 'general'),
('csv-json-converter', 'CSV to JSON & JSON to CSV', 'csv-json-converter', 'file-tools', 'Convert tabular CSV data into clean JSON arrays, or parse JSON into downloadable CSV spreadsheets.', 'Convert tabular CSV data into clean JSON arrays, or parse JSON into downloadable CSV spreadsheets.', 'Table', ARRAY['csv to json', 'json to csv', 'convert spreadsheet to json', 'csv parser online']::text[], false, false, false, '[]'::jsonb, '', '{}'::jsonb, '[]'::jsonb, ARRAY['json-formatter', 'remove-duplicate-lines']::text[], 'general')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category_id = EXCLUDED.category_id,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  icon_name = EXCLUDED.icon_name,
  keywords = EXCLUDED.keywords,
  featured = EXCLUDED.featured,
  popular = EXCLUDED.popular,
  is_new = EXCLUDED.is_new,
  how_to_steps = EXCLUDED.how_to_steps,
  how_it_works = EXCLUDED.how_it_works,
  example_scenario = EXCLUDED.example_scenario,
  faqs = EXCLUDED.faqs,
  related_tool_ids = EXCLUDED.related_tool_ids,
  disclaimer_type = EXCLUDED.disclaimer_type,
  updated_at = NOW();

-- ====================================================================
-- 13. SEED DATA: BLOGS & GUIDES (12 ARTICLES)
-- ====================================================================
INSERT INTO blogs (
  id, slug, title, excerpt, category, author_name, author_role, author_avatar,
  published_date, read_time, cover_image, tags, related_tool_slugs, content,
  faqs, is_published
)
VALUES
('how-to-calculate-your-age-online', 'how-to-calculate-your-age-online', 'How to Calculate Your Exact Age Online (Years, Months, Days & Next Birthday)', 'Learn the exact mathematics behind calculating chronological age, how leap years affect date math, and why client-side calculators provide instant precision.', 'Calculators', 'Dr. Evelyn Vance', 'Senior Computational Mathematician', 'EV', 'August 12, 2026', '5 min read', '', ARRAY['Age Calculation', 'Calendar Math', 'Date Difference', 'Life Milestones']::text[], ARRAY['age-calculator', 'date-calculator', 'time-calculator']::text[], 'Calculating chronological age seems straightforward on paper, but factoring in leap years, month-length variations (28, 29, 30, and 31 days), and precise time zones introduces surprising complexity into digital computation.

## The Mathematical Breakdown of Chronological Age

To compute chronological age without discrepancy:
1. **Year Delta**: Subtract the birth year from the current year ($Y_2 - Y_1$).
2. **Month Adjustment**: If the current month is earlier than the birth month, decrement the year count by 1 and add 12 to the month difference.
3. **Day Adjustment**: If the current day is less than the birth day, borrow days from the preceding calendar month.

### Why Leap Years Matter
Every four years (with exceptions for century years not divisible by 400), a leap day (February 29) is added. A person born on February 29 legally celebrates their birthday on March 1 in non-leap years under most standard jurisdictions.

## Next Birthday Countdown

Our online **Age Calculator** also computes the exact duration until your upcoming birthday, showing remaining calendar months, days, hours, and even the day of the week your birthday will land on next.

## Practical Everyday Use Cases
- **Official Documentation**: Visa, passport, insurance, and retirement eligibility dates.
- **Milestone Tracking**: Counting total days, hours, or minutes lived.
- **School & Sports Enrollment**: Verifying strict age cutoffs.', '[{"question":"How do leap years affect my total days lived?","answer":"Each leap year lived adds an extra calendar day (366 days instead of 365) to your total accumulated days counter."},{"question":"What is the most accurate way to calculate age online?","answer":"Use an online client-side calculator that computes calendar year-month-day intervals rather than dividing total days by 365.25."}]'::jsonb, true),
('how-to-calculate-bmi-correctly', 'how-to-calculate-bmi-correctly', 'How to Calculate BMI Correctly: Metric vs Imperial Formulas & Healthy Ranges', 'Understand Body Mass Index (BMI), the World Health Organization categories, its practical uses, and when to combine it with body fat percentage.', 'Health & Fitness', 'Marcus Sterling', 'Certified Clinical Nutritionist', 'MS', 'August 10, 2026', '6 min read', '', ARRAY['BMI', 'Health & Fitness', 'Body Composition', 'Nutrition']::text[], ARRAY['bmi-calculator', 'bmr-calculator', 'ideal-weight-calculator', 'tdee-calculator']::text[], 'Body Mass Index (BMI) remains one of the most widely utilized screening metrics adopted by healthcare professionals and the World Health Organization (WHO).

## The BMI Formulas

### 1. Metric Formula
$$\text{BMI} = \frac{\text{Weight (kg)}}{[\text{Height (m)}]^2}$$

*Example*: For someone weighing 70 kg with a height of 1.75 m:
$$\text{BMI} = \frac{70}{1.75^2} = \frac{70}{3.0625} = 22.86$$

### 2. Imperial Formula
$$\text{BMI} = \frac{703 \times \text{Weight (lbs)}}{[\text{Height (inches)}]^2}$$

## Official WHO BMI Classifications

| Classification | BMI Range ($kg/m^2$) | Risk of Comorbidities |
| :--- | :--- | :--- |
| **Underweight** | < 18.5 | Low weight risk |
| **Normal Weight** | 18.5 – 24.9 | Average / Optimal |
| **Overweight** | 25.0 – 29.9 | Increased |
| **Obesity Class I** | 30.0 – 34.9 | Moderate |
| **Obesity Class II** | 35.0 – 39.9 | Severe |
| **Obesity Class III** | ≥ 40.0 | Very Severe |

## When Should You Use Additional Metrics?
While BMI is an excellent general screening tool, it does not distinguish between lean skeletal muscle mass and adipose tissue. If you engage in resistance training, pairing BMI with our **Body Fat Percentage Calculator** and **TDEE Calculator** provides a holistic view of body composition.', '[{"question":"What is considered a healthy BMI for adults?","answer":"A BMI between 18.5 and 24.9 is considered the healthy/normal weight range for adult men and women."},{"question":"Can athletes have an overweight BMI while being healthy?","answer":"Yes. Dense muscle tissue weighs more than fat volume, which can yield a higher BMI score despite low body fat."}]'::jsonb, true),
('what-is-compound-interest', 'what-is-compound-interest', 'What Is Compound Interest? How Exponential Growth Multiplies Wealth', 'Albert Einstein famously called compound interest the eighth wonder of the world. Explore the mathematics, compounding frequencies, and formula breakdown.', 'Finance', 'Julian Montgomery', 'Chartered Financial Analyst', 'JM', 'August 06, 2026', '7 min read', '', ARRAY['Compound Interest', 'Investing', 'Wealth Building', 'Financial Literacy']::text[], ARRAY['compound-interest-calculator', 'investment-calculator', 'simple-interest-calculator']::text[], 'Simple interest pays returns solely on the initial principal. In contrast, **compound interest** earns returns on both the starting principal AND all previously accumulated interest.

## The Standard Compound Interest Equation

$$A = P \left(1 + \frac{r}{n}\right)^{nt}$$

Where:
- **$A$** = Final accumulated amount (Principal + Interest)
- **$P$** = Initial principal balance
- **$r$** = Annual nominal interest rate (in decimal format, e.g., 0.08 for 8%)
- **$n$** = Number of times interest compounds per year (12 for monthly, 365 for daily)
- **$t$** = Number of years the funds are invested

## The Rule of 72
Want a fast mental estimate of how long it takes an investment to double? Divide 72 by your annual interest rate:
$$\text{Years to Double} \approx \frac{72}{\text{Interest Rate}}$$
*At 8% annual return: $72 / 8 = 9$ years to double.*

## Why Starting Early Matters
An investor saving $300/month starting at age 25 with an 8% annual return accumulates over $900,000 by age 65, having contributed only $144,000 out-of-pocket. The remaining $750,000+ is pure compound growth!

Test your unique financial projections using our free **Compound Interest Calculator**.', '[{"question":"How does compounding frequency impact returns?","answer":"More frequent compounding (e.g. daily vs annually) yields slightly higher effective returns due to interest being reinvested sooner."}]'::jsonb, true),
('how-to-calculate-percentage-increase', 'how-to-calculate-percentage-increase', 'How to Calculate Percentage Increase and Decrease (Formulas & Real Examples)', 'Master percentage change, profit margins, discounts, and markup conversions with step-by-step arithmetic examples.', 'Calculators', 'Dr. Evelyn Vance', 'Senior Computational Mathematician', 'EV', 'August 04, 2026', '4 min read', '', ARRAY['Percentages', 'Math Formulas', 'Business Math']::text[], ARRAY['percentage-calculator', 'discount-calculator', 'profit-margin-calculator']::text[], 'Percentage changes are ubiquitous across finance, commerce, web analytics, and everyday grocery shopping.

## The Percentage Change Formula

$$\text{Percentage Change} = \left( \frac{\text{New Value} - \text{Old Value}}{|\text{Old Value}|} \right) \times 100$$

- A **positive result** represents a **percentage increase**.
- A **negative result** represents a **percentage decrease**.

### Real-World Example
Suppose a product''s price increases from $80 to $100:
1. Difference: $100 - 80 = 20$
2. Divide by original: $20 / 80 = 0.25$
3. Multiply by 100: $0.25 \times 100 = 25\%$ increase.

Use our **Percentage Calculator** to solve all percentage scenarios in seconds.', '[{"question":"What is the easiest way to calculate 15% in your head?","answer":"Find 10% by moving the decimal one spot to the left, then take half of that (5%) and add them together."}]'::jsonb, true),
('how-to-convert-celsius-to-fahrenheit', 'how-to-convert-celsius-to-fahrenheit', 'How to Convert Celsius to Fahrenheit and Kelvin (Quick Formulas & Cheat Sheet)', 'Clear conversions between temperature scales: Celsius, Fahrenheit, and absolute Kelvin, plus mental shortcuts for travelers.', 'Converters', 'Marcus Sterling', 'Senior Technical Writer', 'MS', 'August 01, 2026', '4 min read', '', ARRAY['Temperature', 'Conversions', 'Metric System']::text[], ARRAY['temperature-converter', 'unit-converter']::text[], 'Converting between Celsius (°C) and Fahrenheit (°F) is essential for cooking, weather forecasting, and international travel.

## Standard Temperature Formulas

- **Celsius to Fahrenheit**: $F = (C \times 9/5) + 32$ or $F = (C \times 1.8) + 32$
- **Fahrenheit to Celsius**: $C = (F - 32) \times 5/9$
- **Celsius to Kelvin**: $K = C + 273.15$

## Quick Mental Approximation for Travelers
To estimate °F from °C quickly: **Double the °C and add 30**.
*Example: 20°C $\rightarrow$ (20 × 2) + 30 = 70°F (Exact is 68°F).*', '[{"question":"At what temperature are Celsius and Fahrenheit equal?","answer":"Celsius and Fahrenheit intersect at exactly -40° (-40°C = -40°F)."}]'::jsonb, true),
('how-to-calculate-loan-payments', 'how-to-calculate-loan-payments', 'How to Calculate Monthly Loan Payments (EMI Formula & Amortization Explained)', 'Understand how banks calculate monthly loan installments, principal reduction, and total interest charges across terms.', 'Finance', 'Julian Montgomery', 'Chartered Financial Analyst', 'JM', 'July 28, 2026', '6 min read', '', ARRAY['Loan Payments', 'EMI', 'Mortgage', 'Interest Rate']::text[], ARRAY['loan-calculator', 'mortgage-calculator', 'salary-calculator']::text[], 'When you borrow money through an amortizing loan, each monthly payment is split between principal reduction and lender interest.

## The Standard Amortization Formula

$$M = P \frac{i(1 + i)^n}{(1 + i)^n - 1}$$

- $M$ = Monthly payment
- $P$ = Loan principal
- $i$ = Monthly interest rate (Annual APR / 12 / 100)
- $n$ = Total number of monthly installments

Use our interactive **Loan Calculator** to see instant payment comparisons and full amortization previews.', '[{"question":"How do interest rates affect monthly payments?","answer":"Higher interest rates increase both your monthly payment and the total lifetime interest paid."}]'::jsonb, true),
('what-is-a-good-bmi', 'what-is-a-good-bmi', 'What Is a Good BMI? Healthy Ranges by Age and Body Type', 'Detailed clinical insights into what constitutes an optimal Body Mass Index, health implications, and age-related adjustments.', 'Health & Fitness', 'Dr. Evelyn Vance', 'Clinical Researcher', 'EV', 'July 25, 2026', '5 min read', '', ARRAY['BMI', 'Healthy Living', 'Weight Management']::text[], ARRAY['bmi-calculator', 'ideal-weight-calculator', 'body-fat-calculator']::text[], 'Discover what clinical research reveals about optimal BMI ranges, metabolic health markers, and how lifestyle factors influence healthy weight benchmarks.', '[{"question":"Does healthy BMI change as you age?","answer":"Research suggests older adults (over 65) often benefit from a slightly higher BMI range (22-27) for greater metabolic resilience."}]'::jsonb, true),
('how-to-calculate-reading-time', 'how-to-calculate-reading-time', 'How to Calculate Reading Time for Articles, Books, and Speeches', 'Explore standard words-per-minute (WPM) benchmarks for silent reading, speech delivery, and content comprehension.', 'Text Tools', 'Marcus Sterling', 'Content Strategist', 'MS', 'July 20, 2026', '4 min read', '', ARRAY['Reading Speed', 'Content Writing', 'Text Analysis']::text[], ARRAY['word-counter', 'character-counter']::text[], 'Average adult reading speed is approximately 200 to 250 words per minute (WPM). For spoken presentations or podcasts, the average speech rate is 130 to 150 WPM.

Test your article or transcript reading time instantly using our free **Word Counter**.', '[{"question":"What is the industry standard reading speed for blog posts?","answer":"Most platforms (like Medium and Substack) use 200–225 WPM to compute estimated reading times."}]'::jsonb, true),
('how-to-compress-images-without-losing-quality', 'how-to-compress-images-without-losing-quality', 'How to Compress Images Without Losing Quality: Client-Side Web Optimization', 'Reduce website load times and save bandwidth using smart lossy/lossless canvas compression and modern WebP conversions.', 'Image Tools', 'Julian Montgomery', 'Frontend Architect', 'JM', 'July 18, 2026', '5 min read', '', ARRAY['Image Compression', 'Web Performance', 'Canvas API', 'SEO']::text[], ARRAY['image-compressor', 'image-resizer', 'jpg-to-png', 'image-format-converter']::text[], 'Unoptimized images are the number one cause of slow webpage loading speeds. By compressing images locally in your browser before uploading, you preserve user privacy and reduce file sizes by 60%–80% without noticeable visual artifacting.

Try our browser-based **Image Compressor** today.', '[{"question":"Are my images uploaded to any server during compression?","answer":"No! ToolVerse compresses images 100% locally on your computer or phone using the browser HTML5 Canvas API."}]'::jsonb, true),
('how-to-create-a-strong-password', 'how-to-create-a-strong-password', 'How to Create a Strong Password: Entropy, Length, and Best Practices for 2026', 'Discover why password length beats complexity, how entropy prevents brute-force cracking, and how to store credentials safely.', 'Security & Generators', 'Dr. Evelyn Vance', 'Cybersecurity Analyst', 'EV', 'July 15, 2026', '6 min read', '', ARRAY['Cybersecurity', 'Password Security', 'Entropy', 'Privacy']::text[], ARRAY['password-generator', 'uuid-generator', 'hash-generator']::text[], 'A 16-character randomized password containing uppercase, lowercase, numbers, and symbols possesses over 90 bits of cryptographic entropy, requiring billions of years to brute-force with modern computing hardware.

Generate secure credentials with our client-side **Password Generator**.', '[{"question":"How long should a strong password be in 2026?","answer":"At least 14 to 16 characters for critical accounts, generated with high entropy."}]'::jsonb, true),
('what-is-a-qr-code', 'what-is-a-qr-code', 'What Is a QR Code? How Quick Response Barcodes Work & How to Make One', 'Learn the technology behind 2D QR matrix barcodes, error correction levels (Reed-Solomon), and versatile applications.', 'Generators', 'Marcus Sterling', 'Senior Technical Writer', 'MS', 'July 10, 2026', '5 min read', '', ARRAY['QR Codes', 'Barcodes', 'Digital Marketing', 'Mobile Tech']::text[], ARRAY['qr-code-generator', 'url-encoder']::text[], 'Invented by Denso Wave in 1994, Quick Response (QR) codes store up to 7,089 numeric characters or 4,296 alphanumeric characters in a high-density 2D matrix.

Create custom styled codes with our free **QR Code Generator**.', '[{"question":"What is QR code error correction?","answer":"Using Reed-Solomon algorithms, QR codes can remain scannable even if up to 30% of the surface is smudged or covered."}]'::jsonb, true),
('how-to-calculate-profit-margin', 'how-to-calculate-profit-margin', 'How to Calculate Profit Margin and Markup: Differences, Formulas & Excel Tips', 'Stop confusing margin and markup! Master gross margin, net margin, and operating profit arithmetic for e-commerce and retail.', 'Finance', 'Julian Montgomery', 'Chartered Financial Analyst', 'JM', 'July 05, 2026', '5 min read', '', ARRAY['Profit Margin', 'Markup', 'E-commerce', 'Business Math']::text[], ARRAY['profit-margin-calculator', 'discount-calculator', 'roi-calculator', 'gst-calculator']::text[], 'Understanding the mathematical distinction between **Profit Margin** and **Markup** is essential for profitable retail and freelance pricing.

## The Formulas

- **Gross Profit Margin (%)** = $\frac{\text{Revenue} - \text{Cost}}{\text{Revenue}} \times 100$
- **Markup Percentage (%)** = $\frac{\text{Revenue} - \text{Cost}}{\text{Cost}} \times 100$

Calculate both simultaneously with our **Profit Margin Calculator**.', '[{"question":"Can profit margin exceed 100%?","answer":"No. Gross margin is always a fraction of total revenue (maximum 100%). However, markup can exceed 100%, 200%, or more."}]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  author_name = EXCLUDED.author_name,
  author_role = EXCLUDED.author_role,
  author_avatar = EXCLUDED.author_avatar,
  published_date = EXCLUDED.published_date,
  read_time = EXCLUDED.read_time,
  cover_image = EXCLUDED.cover_image,
  tags = EXCLUDED.tags,
  related_tool_slugs = EXCLUDED.related_tool_slugs,
  content = EXCLUDED.content,
  faqs = EXCLUDED.faqs,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- ====================================================================
-- 14. SEED DATA: DEFAULT SITE SETTINGS
-- ====================================================================
INSERT INTO site_settings (
  id, site_name, site_tagline, site_url, contact_email, primary_color,
  enable_ads, meta_title, meta_description
)
VALUES (
  'main_config',
  'ToolVerse',
  'Precision Online Tools for Everyday Life',
  'https://toolverse.app',
  'support@toolverse.app',
  '#D4AF37',
  false,
  'ToolVerse — 70+ Free Online Calculators, Converters & Developer Tools',
  'Access 70+ free, instant web tools with zero sign-up required. 100% client-side privacy, accurate math, and lightning-fast performance.'
)
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_tagline = EXCLUDED.site_tagline,
  site_url = EXCLUDED.site_url,
  contact_email = EXCLUDED.contact_email,
  updated_at = NOW();

-- ====================================================================
-- VERIFICATION QUERY
-- ====================================================================
SELECT 'Import Complete!' AS status,
       (SELECT COUNT(*) FROM categories) AS categories_count,
       (SELECT COUNT(*) FROM tools) AS tools_count,
       (SELECT COUNT(*) FROM blogs) AS blogs_count;
