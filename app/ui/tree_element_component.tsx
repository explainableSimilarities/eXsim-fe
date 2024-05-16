'use client';

import { Formula, Predicate, Term } from '../models/models';

export default function TreeElementComponent({myName, children, termsByLevel, fullTerms} : {myName:string, children:Predicate[], termsByLevel:any[], fullTerms:Term[]}) {

    const treeElements = termsByLevel.filter((t) => {
        return t.parents.includes(myName) == 0;
    }).map((t) => {
        return (
            <>
                
            </>
        )
    });

    return (
    <>
        <div className='w-full h-full text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800'>
            
        </div>
    </>
    );
}
