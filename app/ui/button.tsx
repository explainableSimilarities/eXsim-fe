"use client";

export default function Button({
  text,
  icon,
  callback,
}: {
  text: string;
  icon: string;
  callback: (ent: any) => void;
}) {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2 text-md shadow-sm font-semibold shadow-unical-red-900 rounded-lg bg-gradient-to-r from-unical-red-700 to-unical-red-400 transition-all hover:shadow-md hover:shadow-unical-red-700 text-slate-50"
      onClick={callback}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path d={icon} />
      </svg>
      {text}
    </button>
  );
}
