import React from 'react';

export default function GHLFrame({ title, src, height = 700 }) {
  if (!src) return null;
  return (
    <div className="glass-effect rounded-2xl overflow-hidden">
      <iframe
        title={title}
        src={src}
        className="w-full"
        style={{ border: '0', height }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}