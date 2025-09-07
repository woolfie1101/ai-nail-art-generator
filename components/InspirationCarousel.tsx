import React from 'react';

const imageUrls = [
  'https://ygfmjafazvtghusieqwk.supabase.co/storage/v1/object/public/ai-image-get/nail-art1.jpeg',
  'https://ygfmjafazvtghusieqwk.supabase.co/storage/v1/object/public/ai-image-get/nail-art2.jpeg',
  'https://ygfmjafazvtghusieqwk.supabase.co/storage/v1/object/public/ai-image-get/nail-art3.jpeg',
  'https://ygfmjafazvtghusieqwk.supabase.co/storage/v1/object/public/ai-image-get/nail-art4.jpeg',
  'https://ygfmjafazvtghusieqwk.supabase.co/storage/v1/object/public/ai-image-get/nail-art5.jpeg',
];

const InspirationCarousel: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
        Get Inspired
      </h2>
      <div className="w-full inline-flex flex-nowrap overflow-hidden">
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll">
          {imageUrls.map((url, index) => (
            <li key={`first-${index}`}>
              <img src={url} alt={`Nail art inspiration ${index + 1}`} className="h-40 w-auto max-w-none rounded-lg shadow-md" />
            </li>
          ))}
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll" aria-hidden="true">
          {imageUrls.map((url, index) => (
            <li key={`second-${index}`}>
              <img src={url} alt="" className="h-40 w-auto max-w-none rounded-lg shadow-md" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InspirationCarousel;