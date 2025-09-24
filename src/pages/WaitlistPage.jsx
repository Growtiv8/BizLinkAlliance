import React from 'react';
import { Helmet } from 'react-helmet';
import GHLFrame from '@/components/GHLFrame';
import { GHL } from '@/lib/ghlConfig';

const WaitlistPage = () => {
  return (
    <>
      <Helmet>
        <title>Join the Waitlist - BizLink Alliance</title>
      </Helmet>
      <div className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-center font-heading">
            Join the <span className="gradient-text">Waitlist</span>
          </h1>
          {GHL.WAITLIST_FORM_URL ? (
            <GHLFrame title="Waitlist" src={GHL.WAITLIST_FORM_URL} height={900} />
          ) : (
            <p className="text-center text-light-grey font-body">Waitlist form is not configured.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default WaitlistPage;
