import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';

const WEBHOOK = import.meta.env.VITE_GHL_INBOUND_WEBHOOK_URL || '';

export default function FreeRegistrationPage() {
  const formRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
    keys.forEach(k => {
      const el = form.querySelector(`[name="${k}"]`);
      if (el) el.value = urlParams.get(k) || '';
    });
  }, [urlParams]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    const form = formRef.current;
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!WEBHOOK) {
      setStatus('Submission endpoint is not configured. Please set VITE_GHL_INBOUND_WEBHOOK_URL.');
      return;
    }

    setSubmitting(true);
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      // Append chapter tag
      if (data.chapter) {
        data.tags = (data.tags || '') + `,BL|Chapter:${data.chapter}`;
      }

      const res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Submission failed');
      window.location.href = `/thank-you?chapter=${encodeURIComponent(data.chapter || '')}`;
    } catch (err) {
      setStatus('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Free Registration - BizLink Alliance</title>
      </Helmet>
      <div className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6 font-heading">BizLink Alliance — Free Registration</h1>

          <form id="bizlink-free-reg" ref={formRef} noValidate onSubmit={onSubmit} className="glass-effect p-6 rounded-2xl space-y-5">
            {/* Contact */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm mb-1">First Name*</label>
                <input id="first_name" name="first_name" required autoComplete="given-name" className="w-full bg-white/5 p-2 rounded-md"/>
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm mb-1">Last Name*</label>
                <input id="last_name" name="last_name" required autoComplete="family-name" className="w-full bg-white/5 p-2 rounded-md"/>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm mb-1">Email*</label>
                <input id="email" name="email" type="email" required autoComplete="email" className="w-full bg-white/5 p-2 rounded-md"/>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm mb-1">Mobile (for text reminders)*</label>
                <input id="phone" name="phone" type="tel" pattern="^[0-9()+\-.\s]{7,}$" required autoComplete="tel" className="w-full bg-white/5 p-2 rounded-md"/>
              </div>
            </div>

            {/* Business / Role */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="business_name" className="block text-sm mb-1">Business Name</label>
                <input id="business_name" name="business_name" autoComplete="organization" className="w-full bg-white/5 p-2 rounded-md"/>
              </div>
              <div>
                <label htmlFor="role_title" className="block text-sm mb-1">Your Role/Title</label>
                <input id="role_title" name="role_title" autoComplete="organization-title" className="w-full bg-white/5 p-2 rounded-md"/>
              </div>
            </div>
            <div>
              <label htmlFor="website" className="block text-sm mb-1">Website</label>
              <input id="website" name="website" type="url" placeholder="https://" className="w-full bg-white/5 p-2 rounded-md"/>
            </div>

            {/* Chapter & Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chapter" className="block text-sm mb-1">Home Chapter*</label>
                <select id="chapter" name="chapter" required defaultValue="" className="w-full bg-white/5 p-2 rounded-md">
                  <option value="" disabled>Select a chapter</option>
                  <option>Roseville</option>
                  <option>Citrus Heights</option>
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm mb-1">City</label>
                <input id="city" name="city" autoComplete="address-level2" className="w-full bg-white/5 p-2 rounded-md"/>
              </div>
            </div>

            {/* Engagement */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ref_source" className="block text-sm mb-1">How did you hear about us?</label>
                <select id="ref_source" name="ref_source" defaultValue="" className="w-full bg-white/5 p-2 rounded-md">
                  <option value="">Choose one</option>
                  <option>Friend/Referral</option>
                  <option>Facebook</option>
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>Event</option>
                  <option>Search</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="goal_notes" className="block text-sm mb-1">What do you hope to get from BizLink?</label>
                <textarea id="goal_notes" name="goal_notes" rows={3} placeholder="Networking, referrals, learning, etc." className="w-full bg-white/5 p-2 rounded-md"/>
              </div>
            </div>

            {/* Consent */}
            <fieldset className="border border-white/10 rounded-md p-4">
              <legend className="text-sm">Consent</legend>
              <div className="space-y-3 mt-2">
                <div className="flex items-start gap-2">
                  <input id="consent_sms" type="checkbox" name="consent_sms" required className="mt-1"/>
                  <label htmlFor="consent_sms" className="text-sm text-light-grey">
                    I agree to receive emails and text reminders about BizLink Alliance events and membership. Msg &amp; data rates may apply. Reply STOP to opt out. (Required)
                  </label>
                </div>
                <div className="flex items-start gap-2">
                  <input id="code_of_conduct" type="checkbox" name="code_of_conduct" required className="mt-1"/>
                  <label htmlFor="code_of_conduct" className="text-sm text-light-grey">
                    I agree to the BizLink community code of conduct (be respectful, no spam, support fellow members). (Required)
                  </label>
                </div>
              </div>
            </fieldset>

            {/* Hidden system fields */}
            <input type="hidden" name="form_source" value="BizLink Free Registration" />
            <input type="hidden" name="tags" value="BL|Lead,BL|FreeRegistration" />

            {/* UTM capture (auto-filled) */}
            <input type="hidden" name="utm_source" />
            <input type="hidden" name="utm_medium" />
            <input type="hidden" name="utm_campaign" />
            <input type="hidden" name="utm_term" />
            <input type="hidden" name="utm_content" />

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={submitting} className="sacramento-gradient font-body">
                {submitting ? 'Submitting…' : 'Join Free'}
              </Button>
              <p id="bl-status" role="status" aria-live="polite" className="text-sm text-light-grey">{status}</p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
