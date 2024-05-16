'use client';

import {useState} from 'react';
import SecondaryButton from './secondary_button';
const icons: Map<string, string> = new Map();
icons.set("arrow", "M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z");

export default function EntityCard({entity, showButton, buttonInfo, callback}:{entity:any, showButton:boolean, buttonInfo:{icon:string, text:string}, callback:(ent: any) => void}) {

    function normalizeString(mainSense: string) {
        mainSense = mainSense.replaceAll("_", " ");
        return mainSense.charAt(0).toUpperCase() + mainSense.slice(1);
    }

    function extractSynonyms(synonyms:string[]) {
        if(synonyms){
            if(synonyms.length >= 2)
                synonyms = synonyms.slice(0, 2);
        
            return synonyms.map(s => normalizeString(s)).join(", ");
        }
        return synonyms;
    }
    return (
        <div key={entity.name[0]} className='select-none transition-all flex flex-col items-end justify-between gap-4 font-semibold text-slate-600 dark:text-slate-300 max-w-md w-full bg-white dark:bg-slate-800 py-4 px-5 border border-slate-300 dark:border-slate-600 rounded-lg'>
        <div className='flex items-center gap-5 w-full'>
          <div className='min-w-10 min-h-10 bg-cover rounded-md' style={{backgroundImage: `url("` + entity.babelNetEntity.image_url + `"), url("/default.svg")`}}></div>
          <div className='flex flex-col gap-1 overflow-hidden'>
            <div className='flex gap-4 items-center'>
              <span className="text-align-bottom text-transparent text-lg md:text-xl font-bold bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400">{normalizeString(entity.babelNetEntity.main_sense)}</span>
              <span className='text-sm font-semibold text-slate-400 overflow-hidden text-nowrap text-ellipsis'>{extractSynonyms(entity.babelNetEntity.synonyms)}</span>
            </div>
            <span className='text-sm font-semibold overflow-hidden text-nowrap text-ellipsis'>{entity.babelNetEntity.description}</span>
          </div>
        </div>
        <SecondaryButton
          text={buttonInfo.text}
          icon={buttonInfo.icon}
          callback={() => callback(entity)}
        />

        

      </div>
    );
}
