import React from 'react';

const ASTNode = ({ type, value, color = "blue", children }) => {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
  };

  const selectedColor = colors[color] || colors.blue;

  return (
    <div className={`my-2 p-3 border rounded-xl ${selectedColor} not-prose`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">
          {type}
        </span>
        {value && (
          <span className="font-mono font-bold text-sm">
            {value}
          </span>
        )}
      </div>
      {children && (
        <div className="pl-4 border-l border-current border-opacity-20 mt-2 flex flex-col gap-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default ASTNode;
