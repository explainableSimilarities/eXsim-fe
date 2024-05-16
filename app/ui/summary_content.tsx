"use client";

import { useRouter } from "next/navigation";
import { Term } from "../models/models";
import AuxButton from "./aux_button";
export default function SummaryContent({ entity }: { entity: Term }) {
    const router = useRouter();

    function normalizeString(mainSense: string) {
        mainSense = mainSense.replaceAll("_", " ");
        return mainSense.charAt(0).toUpperCase() + mainSense.slice(1);
    }

    function extractSynonyms(synonyms:string[]) {
        if(synonyms){
            return synonyms.map(s => normalizeString(s)).join(", ");
        }
        return synonyms;
    }

    return (
        <>
        <div className='flex items-center gap-7 w-full mt-8 mb-6'>
          {
}
          <img className='w-14 h-14 bg-cover border border-slate-300 dark:border-slate-600 rounded-md' src={entity.babelNetEntity && entity.babelNetEntity.image_url || ""}></img>
          <span className="text-align-bottom text-transparent text-xl md:text-2xl font-bold bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400">{entity.babelNetEntity && normalizeString(entity.babelNetEntity.main_sense)}</span>
        </div>
        <span className='text-base md:text-lg font-semibold text-slate-600 dark:text-slate-300'>{entity.babelNetEntity && entity.babelNetEntity.description}</span>
        {entity.babelNetEntity?.synonyms && entity.babelNetEntity?.synonyms.length > 0 && <div className="flex items-center gap-3 mt-8 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 fill-red-600 transition-all"
          >
            <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
          </svg>
          <span className="text-align-bottom text-lg md:text-xl font-bold text-slate-600 dark:text-slate-300 w-fit">
            Also known as
          </span>
        </div>}
        <span className='text-sm md:text-base font-semibold text-slate-400 pb-14'>{entity.babelNetEntity && extractSynonyms(entity.babelNetEntity.synonyms)}</span>
        
        
        </>
    );

}
