import React from 'react';

const ResearchHighlight = ({ title, children }) => {
  return (
    <div className="my-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl shadow-sm not-prose">
      <h4 className="text-blue-800 font-bold mt-0 mb-2">💡 {title}</h4>
      <div className="text-blue-900 italic text-lg leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default ResearchHighlight;
