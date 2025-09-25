import React, { useEffect } from 'react';

export default function FacebookEventsEmbed({ pageUrl }) {
  useEffect(() => {
    if (!pageUrl) return;
    // Load FB SDK once
    if (!document.getElementById('facebook-jssdk')) {
      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.async = true;
      js.defer = true;
      js.crossOrigin = 'anonymous';
      js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0';
      document.body.appendChild(js);
    } else if (window.FB && window.FB.XFBML) {
      window.FB.XFBML.parse();
    }
  }, [pageUrl]);

  if (!pageUrl) return null;

  return (
    <div className="glass-effect rounded-2xl p-4 overflow-hidden">
      <div id="fb-root"></div>
      <div
        className="fb-page"
        data-href={pageUrl}
        data-tabs="events"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="false"
      >
        <blockquote cite={pageUrl} className="fb-xfbml-parse-ignore">
          <a href={pageUrl}>Facebook Page Events</a>
        </blockquote>
      </div>
    </div>
  );
}