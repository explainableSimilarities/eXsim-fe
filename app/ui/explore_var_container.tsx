'use client';

import { useRouter } from 'next/navigation';
import { EntitySummary, Formula, Term, TermType, Unit } from '../models/models';
import TreeElementComponent from './tree_element_component';
import EntityCard from './entity_card';
import AuxButton from './aux_button';
import { useEffect, useRef, useState } from 'react';

export default function ExploreVarContainer({ predicates, boundVar, closeCallback }: { predicates: string[], boundVar: Term, closeCallback: () => void }) {
    const router = useRouter();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [selectedPredicate, setSelectedPredicate] = useState(predicates[0] as string);
    const [selectedUnitSummaryIndex, setSelectedUnitSummaryIndex] = useState(0);
    const [unit, setUnit] = useState(null as Unit | null);

    const [page, setPage] = useState(1);

    const termList = unit?.entities[selectedUnitSummaryIndex]?.summary.atoms.predicates.filter((p) => {
        return p.name == selectedPredicate && !p.is_deriv && (p.terms[1].name.length > 1 || boundVar.name.includes(p.terms[1].name[0]));
    }).flatMap((p) => {
        return p.terms[1].name;
    })

    const fullTermsList = unit?.entities[selectedUnitSummaryIndex]?.summary.terms.filter((t) => { return termList?.includes(t.id) }) || [];

    function update() {
        if (page * 20 < fullTermsList.length) {
            setPage(page + 1);
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("lastUnit")) {
            router.push("/");
        } else {
            let stored_unit = Unit.fromJson(JSON.parse(localStorage.getItem("lastUnit") || ""));

            if (stored_unit.entities[0].summary.atoms.predicates.length == 0) {
                router.push("/dashboard");
            }
            else {
                setUnit(stored_unit);
                setSelectedUnitSummaryIndex(0);
            }
        }
    }, []);

    function normalizePredicateName(str: string) {
        if (str == "HYPER")
            return "is a";

        str = str.replaceAll("_", " ");
        return str.toLowerCase();
    }

    function normalizeString(mainSense: string) {
        mainSense = mainSense.replaceAll("_", " ");
        return mainSense.charAt(0).toUpperCase() + mainSense.slice(1);
    }

    const entities = fullTermsList.slice(0, (fullTermsList.length < page * 20 ? fullTermsList.length : page * 20)).map(r =>
        <EntityCard
            entity={r.full_repr}
            showButton={true}
            buttonInfo={{
                icon: 'M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z',
                text: 'See summary'
            }}
            callback={() => { router.push("/" + r.full_repr?.name[0]) }}
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

                <div className='w-full flex flex-wrap gap-8 items-center'>
                    <div className='flex flex-col gap-2 font-bold'>
                        <span>Predicate</span>
                        <select
                            value={selectedPredicate}
                            onChange={e => {
                                if(scrollContainerRef.current)
                                    scrollContainerRef.current.scrollTop = 0;
                                setPage(1); 
                                setSelectedPredicate(e.target.value);
                            }}
                            className='focus:outline-0 ring-0 font-semibold text-slate-600 dark:text-slate-300 w-fit bg-white dark:bg-slate-800 py-1 px-3 border border-slate-300 dark:border-slate-600 rounded-lg'
                        >
                            {
                                predicates.map((p) => {
                                    return <option key={p} value={p}>
                                        {normalizePredicateName(p)}
                                    </option>
                                })
                            }
                        </select>
                    </div>

                    <div className='flex flex-col gap-2 font-bold'>
                        <span>Entity</span>
                        <select
                            value={selectedUnitSummaryIndex}
                            onChange={e => {
                                if(scrollContainerRef.current)
                                    scrollContainerRef.current.scrollTop = 0;
                                setPage(1); 
                                setSelectedUnitSummaryIndex(e.target.value as unknown as number);
                            }}
                            className='font-semibold text-slate-600 dark:text-slate-300 w-fit bg-white dark:bg-slate-800 py-1 px-3 border border-slate-300 dark:border-slate-600 rounded-lg'
                        >
                            {
                                Array.from(Array(unit?.entities.length).keys()).map((i) => {
                                    return <option key={i} value={i}>
                                        {normalizeString(unit?.entities[i].entity[0].babelNetEntity?.main_sense || "")}
                                    </option>
                                })
                            }
                        </select>
                    </div>
                </div>

                <div className='transition-all flex w-full flex-wrap gap-4 overflow-y-scroll'
                    ref={scrollContainerRef}
                    onScroll={(e) => {if((e.target as HTMLDivElement).scrollHeight - (e.target as HTMLDivElement).scrollTop <= 1000) update()}}
                >
                    {entities}
                </div>
            </div>
        </>
    );
}
