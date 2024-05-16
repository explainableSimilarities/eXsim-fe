'use client';

import { Formula, Term, TermType } from '../models/models';
import TreeElementComponent from './tree_element_component';

export default function TreeFormulaContainer({formula, terms, seeMore, exploreVar} : {formula:Formula, terms:Term[], seeMore: (t:Term) => void, exploreVar: (predicates:string[], boundVar:Term) => void}) {
    const termsByLevel = [] as any[]

    formula.predicates.forEach((p) => {
        const parentName = (p.terms[0].type == TermType.FREE_VARIABLE ? "x_" : (p.terms[0].type == TermType.BOUND_VARIABLE ? "y_" : "")) + p.terms[0].name.join(",");
        const parent = termsByLevel.find((t) => {return t.name == parentName})
        if(parent) {
            parent.children = [...parent.children, p]
        }
        else {
            termsByLevel.push({name: parentName, parents: [], children: [p]})
        }

        const childName = (p.terms[1].type == TermType.FREE_VARIABLE ? "x_" : (p.terms[1].type == TermType.BOUND_VARIABLE ? "y_" : "")) + p.terms[1].name.join(",");
        const child = termsByLevel.find((t) => {return t.name == childName})
        if(child) {
            child.parents = [...child.parents, parentName]
        }
        else {
            termsByLevel.push({name: childName, parents: [parentName], children: []})
        }
    })

    const treeElements = termsByLevel.filter((t) => {
        return t.parents.length == 0;
    }).map((t) => {
        return (
            <>
                <TreeElementComponent
                    myName={t.name}
                    children={t.children}
                    termsByLevel={termsByLevel}
                    fullTerms={terms}
                />
            </>
        )
    });

    return (
    <>
        <div className='w-full h-full text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800'>
            {treeElements}
        </div>
    </>
    );
}
