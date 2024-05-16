'use client';

export default function AuxButton({text, icon, callback}: {text:string, icon:string, callback:(ent: any) => void}) {
    return (
        <button onClick={callback} className='group select-none transition-all flex items-center gap-2 w-fit'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 fill-red-600 transition-all opacity-70 group-hover:opacity-100">
        <path fillRule="evenodd" d={icon} clipRule="evenodd" />
      </svg>
      <span className='transition-all font-semibold text-sm md:text-base text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'>{text}</span>
    </button>
    );
}