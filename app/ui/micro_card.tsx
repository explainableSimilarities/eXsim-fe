'use client';

const icons: Map<string, string> = new Map();
icons.set("arrow", "M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z");

export default function MicroCard({entity}:{entity:any}) {

    return (
        <div key={entity.name[0]} className='select-none transition-all flex flex-col items-end justify-between gap-4 font-semibold text-slate-600 dark:text-slate-300 max-w-md w-fit bg-white dark:bg-slate-800 py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg'>
        <div className='flex items-center gap-5 w-full'>
          <div className='min-w-8 min-h-8 bg-cover rounded-md' style={{backgroundImage: `url("` + entity.babelNetEntity.image_url + `"), url("/default.svg")`}}></div>
        </div>
      </div>
    );
}
