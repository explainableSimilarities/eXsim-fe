'use client';

import { EntitySummary, Formula, Predicate, Term } from '../models/models';
import MyGraph from './graph_wrapper';
import {useLayoutEffect, useRef, useState, useEffect} from 'react';

export default function GraphContainer({formula, terms, nodeLimit, extended, seeMore, exploreVar} : {formula:Formula, terms:Term[], nodeLimit:number, extended:boolean, seeMore: (t:Term) => void, exploreVar: (predicates:string[], boundVar:Term) => void}) {
    
    const ref = useRef<HTMLDivElement>(null);

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        if(ref.current) {
            setWidth(ref.current.offsetWidth);
            setHeight(ref.current.offsetHeight);
        }
    }, []);

    useEffect(() => {
        function handleWindowResize() {
            refreshGraph();
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    useEffect(() => {
        refreshGraph();
    }, [extended]);

    const refreshGraph = () => {
        if(ref.current) {
            setWidth(ref.current.clientWidth);
            setHeight(ref.current.clientHeight);
        }
    }

    return (
    <>
        <div ref={ref} className='overflow-hidden w-full h-full text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800'>
            <MyGraph width={width} height={height} formula={formula} terms={terms} nodeLimit={nodeLimit} seeMore={seeMore} exploreVar={exploreVar}/>
        </div>
    </>
    );
}
