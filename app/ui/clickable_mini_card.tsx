'use client';

const icons: Map<string, string> = new Map();
icons.set("arrow", "M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z");

export default function ClickableMiniCard({entity, clickCallback}:{entity:any, clickCallback: () => void}) {


    function normalizeString(mainSense: string) {
        mainSense = mainSense.replaceAll("_", " ");
        return mainSense.charAt(0).toUpperCase() + mainSense.slice(1);
    }
   
    return (
        <div key={entity.name[0]} className='select-none transition-all flex flex-col items-end justify-between gap-4 font-semibold text-slate-600 dark:text-slate-300 max-w-md w-fit bg-white dark:bg-slate-800 py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-unical-red-300/30 hover:cursor-pointer' onClick={clickCallback}>
        <div className='flex items-center gap-5 w-full'>
          <div className='min-w-8 min-h-8 bg-cover rounded-md' style={{backgroundImage: `url("` + entity.babelNetEntity.image_url + `"), url("/default.svg")`}}></div>
          <div className='flex flex-col gap-1 overflow-hidden'>
            <div className='flex gap-4 items-center'>
              <span className="text-align-bottom text-base font-semibold text-slate-600 dark:text-slate-300">{normalizeString(entity.babelNetEntity.main_sense)}</span>
            </div>
          </div>
        </div>
      </div>
    );
}
