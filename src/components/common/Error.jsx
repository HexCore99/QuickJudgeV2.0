import React from "react";

function Error({ error }) {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    </div>
  );
}

export default Error;
