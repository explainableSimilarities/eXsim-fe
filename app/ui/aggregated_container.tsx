'use client';

import { useRouter } from 'next/navigation';
import { Formula, Term, TermType } from '../models/models';
import TreeElementComponent from './tree_element_component';
import EntityCard from './entity_card';
import AuxButton from './aux_button';
import { useRef, useState } from 'react';

export default function AggregatedContainer({aggregatedTerm, terms, closeCallback} : {aggregatedTerm:Term, terms:Term[], closeCallback:() => void}) {
    const router = useRouter();

    const termList = aggregatedTerm.name.map((name) => {
        return terms.find((t) => {return t.name[0] == name});
    })


    const [page, setPage] = useState(1);

    function update() {
        if(page * 20 < termList.length) {
            setPage(page + 1);
        }  
    }

    const entities = termList.slice(0, (termList.length < page * 20 ? termList.length : page * 20)).map(r => 
        <EntityCard 
        entity={r} 
        showButton={true}
        buttonInfo={{
            icon: 'M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z',
            text: 'See summary'
        }} 
        callback={() => {router.push("/" + r?.name[0])}}
      />
    );

    return (
    <>
        <div className='w-full h-full flex flex-col gap-6 mt-6 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 overflow-hidden'>
            <AuxButton
                icon={"M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z"}
                text={"Back to result"}
                callback={closeCallback}
            />
            <div className='transition-all flex w-full flex-wrap gap-4 overflow-y-scroll'
                onScroll={(e) => {if((e.target as HTMLDivElement).scrollHeight - (e.target as HTMLDivElement).scrollTop <= 1000) update()}}
            >
                {entities}
            </div>
        </div>
    </>
    );
}
