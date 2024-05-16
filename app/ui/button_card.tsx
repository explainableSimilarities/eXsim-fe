'use client';

export default function CardButton({ mainText, secondaryText, icon, callback }: { mainText: string, secondaryText: string, icon: string, callback: (ent: any) => void }) {
    return (
        <button onClick={callback} className='shadow-sm group select-none transition-all flex items-center gap-6 w-full bg-slate-200/70 rounded-lg py-6 px-6 pr-7 hover:shadow-md dark:shadow-slate-700/40 dark:hover:shadow-slate-700/40 dark:bg-slate-800'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 fill-red-600 transition-all opacity-70 group-hover:opacity-100">
                <path fillRule="evenodd" d={icon} clipRule="evenodd" />
            </svg>
            <div className="flex flex-col items-start text-left">
                <span className='font-bold text-base md:text-lg text-slate-700 dark:text-slate-300'>{mainText}</span>
                <span className='font-semibold text-sm md:text-base text-slate-500 dark:text-slate-400'>{secondaryText}</span>
            </div>
        </button>
    );
}