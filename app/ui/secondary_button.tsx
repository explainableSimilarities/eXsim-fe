'use client';

export default function SecondaryButton({ text, icon, callback, disabled = false }: { text: string, icon: string, callback: (ent: any) => void, disabled?: boolean }) {
  return (
    <button onClick={callback} disabled={disabled} className={'shadow-sm group select-none transition-all flex items-center gap-2 rounded-lg py-2 px-3 pr-4 dark:shadow-slate-600/40' + (disabled ? " dark:bg-slate-800 bg-slate-100" : " dark:bg-slate-700 bg-slate-200 hover:shadow-md dark:hover:shadow-slate-600/40")}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={"w-5 h-5 fill-red-600 transition-all" + (disabled ? " opacity-50": " opacity-70 group-hover:opacity-100")}>
        <path fillRule="evenodd" d={icon} clipRule="evenodd" />
      </svg>
      <span className={'font-semibold text-sm md:text-base' + (disabled ? " text-slate-600 dark:text-slate-400" : " text-slate-700 dark:text-slate-300")}>{text}</span>
    </button>
  );
}