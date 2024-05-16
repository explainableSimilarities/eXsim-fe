"use client";

import { useRef, useState } from "react";

import GraphContainer from "./graph_container";
import AuxButton from "./aux_button";
import { EntitySummary, Formula, Predicate, Term } from "../models/models";
import Spinner from "./spinner";
import TextFormulaContainer from "./text_formula_container";
import AggregatedContainer from "./aggregated_container";
import ExploreVarContainer from "./explore_var_container";

export default function GraphComponent({
  trigger,
  toggleTrigger,
  resultExpanded,
  toggleResult,
  formula,
  terms,
  nodeLimit,
  dataLoading
}: {
  trigger: boolean;
  toggleTrigger: () => void;
  resultExpanded: boolean;
  toggleResult: () => void;
  formula:Formula;
  terms:Term[];
  nodeLimit:number;
  dataLoading: boolean;
}) {
  const graphContainerRef = useRef(null);
  const [showGraph, setShowGraph] = useState(true);

  const [showAggregated, setShowAggregated] = useState(false);
  const [aggregated, setAggregated] = useState(null as Term | null);

  const [showExploreVar, setShowExploreVar] = useState(false);
  const [varPredicates, setVarPredicates] = useState([] as string[]);
  const [varTerm, setVarTerm] = useState(null as Term | null);

  const seeMore = (t:Term) => {
    setShowAggregated(true);
    setAggregated(t);
  }

  const exploreVar = (predicates:string[], boundVar:Term) => {
    setShowExploreVar(true);
    setVarPredicates(predicates);
    setVarTerm(boundVar);
  }

  return (
    <>
      <div
        ref={graphContainerRef}
        onTransitionEnd={(e) => {
          if (e.target == graphContainerRef.current) toggleTrigger();
        }}
        className={
          "transition-all flex-col gap-4 h-screen relative grow py-6 px-8 pb-14 border-l border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-600/40" +
          (!resultExpanded ? " hidden md:flex md:w-4/12" : " flex w-full")
        }
      >
        <AuxButton
          text={resultExpanded ? "Reduce view" : "Expand view"}
          icon={
            resultExpanded
              ? "M3.22 3.22a.75.75 0 0 1 1.06 0l3.97 3.97V4.5a.75.75 0 0 1 1.5 0V9a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1 0-1.5h2.69L3.22 4.28a.75.75 0 0 1 0-1.06Zm17.56 0a.75.75 0 0 1 0 1.06l-3.97 3.97h2.69a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0ZM3.75 15a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-2.69l-3.97 3.97a.75.75 0 0 1-1.06-1.06l3.97-3.97H4.5a.75.75 0 0 1-.75-.75Zm10.5 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-2.69l3.97 3.97a.75.75 0 1 1-1.06 1.06l-3.97-3.97v2.69a.75.75 0 0 1-1.5 0V15Z"
              : "M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z"
          }
          callback={() => {
            toggleResult();
          }}
        />
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 fill-red-600 transition-all"
          >
            <path
              fillRule="evenodd"
              d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-align-bottom text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300 w-fit">
            Your result
          </span>
        </div>
        <nav className="flex gap-2">
          <button
            aria-selected={showGraph}
            onClick={() => setShowGraph(true)}
            className="transition-all aria-selected:bg-unical-red-200 dark:aria-selected:bg-unical-red-800 rounded-lg py-1 px-3 hover:shadow-sm hover:bg-unical-red-200 dark:hover:bg-unical-red-800 dark:shadow-slate-600/40 dark:hover:shadow-slate-600/40 dark:bg-slate-800 font-semibold text-sm md:text-base text-slate-700 dark:text-slate-300"
          >
            Graph
          </button>
          <button
            aria-selected={!showGraph}
            onClick={() => setShowGraph(false)}
            className="transition-all aria-selected:bg-unical-red-200 dark:aria-selected:bg-unical-red-800 rounded-lg py-1 px-3 hover:shadow-sm hover:bg-unical-red-200 dark:hover:bg-unical-red-800 dark:shadow-slate-600/40 dark:hover:shadow-slate-600/40 dark:bg-slate-800 font-semibold text-sm md:text-base text-slate-700 dark:text-slate-300"
          >
            Text
          </button>
        </nav>
        {dataLoading && 
        <div className='overflow-hidden w-full h-full flex items-center justify-center text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800'>
            <Spinner />
        </div>
        }
        {!dataLoading && showGraph && !showAggregated && !showExploreVar && <GraphContainer extended={trigger} formula={formula} terms={terms} nodeLimit={nodeLimit} seeMore={seeMore} exploreVar={exploreVar}/>}
        {!dataLoading && !showGraph && !showAggregated && !showExploreVar && <TextFormulaContainer formula={formula} terms={terms} seeMore={seeMore} exploreVar={exploreVar}/>}
        {!dataLoading && showAggregated && aggregated && <AggregatedContainer aggregatedTerm={aggregated} terms={terms} closeCallback={() => setShowAggregated(false)}/>}
        {!dataLoading && !showAggregated && showExploreVar && varPredicates.length > 0 && varTerm && <ExploreVarContainer predicates={varPredicates} boundVar={varTerm} closeCallback={() => setShowExploreVar(false)}/>}
      </div>
    </>
  );
}
