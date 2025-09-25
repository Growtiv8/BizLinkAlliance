// Import users from a JSON file into Supabase Auth and upsert minimal profiles.
// Usage (example): node tools/import-users.js ./sample-data/users.sample.json
// Requires env: SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL (or VITE_SUPABASE_URL)

import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('[import-users] Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

function randPassword(len = 14) {
  return crypto.randomBytes(Math.ceil(len * 0.75)).toString('base64').slice(0, len);
}

function mapBizlinkRoleToMembership(role) {
  if (!role) return undefined;
  const v = String(role).toLowerCase();
  if (v.includes('board')) return 'board';
  if (v.includes('admin')) return 'board';
  if (v.includes('regular')) return 'premium';
  if (v.includes('premium')) return 'premium';
  if (v.includes('free') || v.includes('guest')) return 'free';
  return undefined;
}

function mapDatabaseRoleToMembership(role) {
  if (!role) return undefined;
  const v = String(role).toLowerCase();
  if (v === 'board' || v === 'admin') return 'board';
  return undefined; // 'user' -> undefined
}

function normalizeRecord(rec) {
  // Accept both snake_case and camelCase inputs
  const first = (rec.first_name || rec.firstName || '').trim();
  const last = (rec.last_name || rec.lastName || '').trim();
  const business_name = rec.business_name || rec.businessName || undefined;
  const role_title = rec.role_title || rec.title || undefined;
  const website = rec.website || undefined;
  const city = rec.city || undefined;
  const chapter = rec.chapter || rec.homeChapter || undefined;
  const membership_from_role = mapBizlinkRoleToMembership(rec.membership_type || rec.bizlinkRole);
  const membership_from_db_role = mapDatabaseRoleToMembership(rec.databaseRole);
  const membership_type = rec.membership_type || membership_from_db_role || membership_from_role || 'free';
  const linkedin = rec.linkedin || rec.socialMedia?.linkedin || undefined;
  const facebook = rec.facebook || rec.socialMedia?.facebook || undefined;

  const name = rec.name?.trim() || [first, last].filter(Boolean).join(' ') || rec.email?.split('@')[0] || 'User';
  return {
    email: (rec.email || '').toLowerCase(),
    password: rec.password || randPassword(),
    phone: rec.phone || undefined,
    name,
    metadata: {
      name,
      first_name: first || undefined,
      last_name: last || undefined,
      business_name,
      role_title,
      website,
      city,
      chapter,
      membership_type,
      ref_source: rec.ref_source || undefined,
      bio: rec.bio || undefined,
      photo: rec.photo || undefined,
      linkedin,
      facebook,
      source_id: rec._id?.$oid || rec._id || undefined,
      source_date: rec.date || undefined,
    },
  };
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node tools/import-users.js <path-to-users.json>');
    process.exit(1);
  }

  const raw = await fs.readFile(file, 'utf8');
  const data = JSON.parse(raw);
  const users = Array.isArray(data) ? data : (Array.isArray(data.users) ? data.users : []);
  if (!users.length) {
    console.error('[import-users] No users found in JSON. Expecting an array or { users: [...] }');
    process.exit(1);
  }

  console.log(`[import-users] Importing ${users.length} users...`);
  let created = 0, skipped = 0, profileErrors = 0;

  for (const rec of users) {
    const u = normalizeRecord(rec);
    if (!u.email) {
      console.warn('[import-users] Skipping record without email.');
      skipped++; continue;
    }
    try {
      const { data: createdUser, error: createErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        phone: u.phone,
        user_metadata: u.metadata,
      });
      if (createErr) {
        console.warn(`[import-users] Skipping ${u.email}: ${createErr.message}`);
        skipped++; continue;
      }

      // Minimal profiles upsert: id and name (avoid schema mismatch). Add more fields if your schema supports them.
      const profile = { id: createdUser.user.id, name: u.name };
      const { error: upsertErr } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' });
      if (upsertErr) {
        console.warn(`[import-users] Profile upsert failed for ${u.email}: ${upsertErr.message}`);
        profileErrors++;
      }

      created++;
      console.log(`[import-users] Imported ${u.email}`);
    } catch (e) {
      console.error(`[import-users] Error on ${u.email}:`, e.message);
      skipped++;
    }
  }

  console.log(`[import-users] Done. Created: ${created}, Skipped: ${skipped}, Profile errors: ${profileErrors}`);
}

main().catch(err => {
  console.error('[import-users] Fatal:', err);
  process.exit(1);
});
