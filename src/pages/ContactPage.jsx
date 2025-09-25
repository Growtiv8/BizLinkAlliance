import React from 'react';
import { Helmet } from 'react-helmet';
import GHLFrame from '@/components/GHLFrame';
import { GHL } from '@/lib/ghlConfig';

export default function ContactPage() {
  const hasForm = Boolean(GHL.CONTACT_FORM_URL);
  const hasCalendar = Boolean(GHL.CALENDAR_URL);
  const hasEmbeds = hasForm || hasCalendar;

  return (
    <>
      <Helmet>
        <title>Contact - BizLink Alliance</title>
      </Helmet>
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 font-heading">
            Get in <span className="gradient-text">Touch</span>
          </h1>

          {hasEmbeds ? (
            <div className="grid md:grid-cols-2 gap-8">
              {hasForm && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 font-heading">Contact Form</h2>
                  <GHLFrame title="Contact" src={GHL.CONTACT_FORM_URL} height={900} />
                </div>
              )}
              {hasCalendar && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 font-heading">Book a Call</h2>
                  <GHLFrame title="Calendar" src={GHL.CALENDAR_URL} height={900} />
                </div>
              )}
            </div>
          ) : (
            <div className="glass-effect rounded-2xl p-6">
              <p className="text-light-grey font-body">
                No GHL contact or calendar URLs are configured. Please add the following to your .env file:
              </p>
              <ul className="list-disc pl-6 mt-3 text-sm text-light-grey">
                <li>VITE_GHL_CONTACT_FORM_URL</li>
                <li>VITE_GHL_CALENDAR_URL</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
