import React from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Link } from 'react-router-dom';

export default function ThankYouPage() {
  const [params] = useSearchParams();
  const chapter = params.get('chapter');

  return (
    <>
      <Helmet>
        <title>Thank You - BizLink Alliance</title>
      </Helmet>
      <div className="pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4 font-heading">Thank you for joining BizLink Alliance!</h1>
          {chapter && (
            <p className="text-light-grey font-body mb-4">We'll be in touch about events in the {chapter} chapter.</p>
          )}
          <p className="text-light-grey font-body mb-8">Check your email for a confirmation and next steps.</p>
          <Link to="/events" className="text-yellow-gold hover:underline font-body">See upcoming events</Link>
        </div>
      </div>
    </>
  );
}
