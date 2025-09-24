# BizLink Alliance

Business networking platform for the Greater Sacramento area. Built with React, Vite, TailwindCSS, and Supabase.

## Quick start

1) Install dependencies

2) Set environment variables by creating a `.env` file at the project root:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EVENTS_JSON_FEED_URL=https://example.com/events.json # optional - external events feed (Make.com)
VITE_FACEBOOK_PAGE_URL=https://www.facebook.com/your-page # optional - show FB events tab embed

3) Start the dev server

## Tech stack

- React 18 + Vite
- TailwindCSS + Radix UI
- Supabase (Auth + Database)

## Optional: GoHighLevel integration

You can embed your BizLink Alliance subaccount assets:

- Chat widget: set `VITE_GHL_WIDGET_SCRIPT_URL` and `VITE_GHL_WIDGET_RESOURCES_URL`
- Forms/Calendars: set public URLs for `VITE_GHL_WAITLIST_FORM_URL`, `VITE_GHL_CONTACT_FORM_URL`, `VITE_GHL_CALENDAR_URL`

Pages auto-detect and render embeds when provided:

- Waitlist page: `/waitlist` uses `VITE_GHL_WAITLIST_FORM_URL` for lead collection
- Directory: renders contact form and/or calendar if URLs are provided
- Contact page: `/contact` will appear in the navbar if either `VITE_GHL_CONTACT_FORM_URL` or `VITE_GHL_CALENDAR_URL` is set. It embeds your public form and calendar via iframes.
 - Free Registration: `/register/free` posts to your GHL inbound webhook if `VITE_GHL_INBOUND_WEBHOOK_URL` is set, and redirects to `/thank-you` on success.

## Events sources

The Events page supports two sources in this order:

1. External JSON feed (recommended for automation): set `VITE_EVENTS_JSON_FEED_URL` to a Make.com-hosted JSON. Expected fields per item: `title`, `description`, `date` (ISO), `time`, `location`, optional `authorName`, `type`.
2. Supabase table fallback: if the external feed is not set or fails, events are loaded from the `events` table joined with `profiles(name)`.

Additionally, if `VITE_FACEBOOK_PAGE_URL` is set, a read-only Facebook Page events embed is shown in the left column beneath the calendar.

## Notes

- Auth and profiles: `SupabaseAuthContext` wraps the app and exposes signUp/signIn/signOut and helpers to update membership and profile.
- The Supabase client prefers env variables. Fallback values are included for development only; replace them with your own env vars.
- Custom Vite plugins support in-iframe development and a visual inline editor for dev.
