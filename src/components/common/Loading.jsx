import React from "react";

function Loading({ description }) {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
        {description}
      </div>
    </div>
  );
}

export default Loading;
