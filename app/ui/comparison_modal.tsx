"use client";

import { useEffect, useState } from "react";
import {
  Formula,
  Predicate,
  Term,
  TermType,
  Unit,
  UnitRelationType,
} from "../models/models";
import AuxButton from "./aux_button";
import CompareTextFormulaContainer from "./compare_text_formula_container";

export default function ComparisonModal({
  unit1,
  unit2,
  simRelation,
  closeMe,
}: {
  unit1: Unit;
  unit2: Unit;
  simRelation: UnitRelationType | undefined;
  closeMe: () => void;
}) {
  const [terms, setTerms] = useState([] as Term[]);

  const [commonPredicates, setCommonPredicates] = useState([] as Predicate[]);


  useEffect(() => {
    let newTerms = [] as Term[];
    unit1.entities.forEach((e) => {
      e.summary.terms.forEach((t) => {
        newTerms.push(t.full_repr || new Term([], TermType.CONSTANT));
      });
    });

    unit2.entities.forEach((e) => {
      e.summary.terms.forEach((t) => {
        newTerms.push(t.full_repr || new Term([], TermType.CONSTANT));
      });
    });

    let newCommonPredicates = [] as Predicate[];
    unit1.characterization?.predicates.forEach((p1) => {
      unit2.characterization?.predicates.find((p2) => {
        if (Predicate.predComparison(p1, p2)) {
          newCommonPredicates.push(p1);
        }
      });
    });

    setTerms(newTerms);
    setCommonPredicates(newCommonPredicates);
  }, []);

  return (
    <>
      <div className="fixed flex items-center justify-center z-[500] top-0 left-0 w-full h-full">
        <div
          className={
            "select-none transition-all flex flex-col w-full h-full md:w-[80%] md:h-[80%] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 justify-top items-left px-16 py-16 border border-slate-300 dark:border-slate-600 rounded-lg blur:none margin-0"
          }
        >
          <div className="w-full h-full flex flex-col justify-between items-left gap-16">
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-4 w-full">
                <span className="mt-4 text-lg md:text-xl font-semibold text-slate-600 dark:text-slate-300">
                  {simRelation == UnitRelationType.INC &&
                    "The two sets of entities are incomparable"}
                  {simRelation == UnitRelationType.PREC &&
                    "The first set of entities is more specific than the second"}
                  {simRelation == UnitRelationType.SIM &&
                    "The first set of entities is similar to the second"}
                  {simRelation == UnitRelationType.SUCC &&
                    "The first set of entities is more generic than the second"}
                </span>

                <span className="mt-2 text-sm md:text-base font-semibold text-slate-400">
                  {simRelation == UnitRelationType.INC &&
                    "The two formulas are different."}
                  {simRelation == UnitRelationType.PREC &&
                    "Comparing the two formulas, you can see that the first one is more specific."}
                  {simRelation == UnitRelationType.SIM &&
                    "Both sets are characterized by the same formula."}
                  {simRelation == UnitRelationType.SUCC &&
                    "Comparing the two formulas, you can see that the second one is more specific."}
                </span>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row h-full overflow-hidden relative">
              <div className="flex lg:h-full h-[calc(50%-1.532rem)] lg:w-1/2 w-full flex-col gap-4 relative">
                <CompareTextFormulaContainer
                  terms={terms}
                  formula={unit1.characterization || new Formula([])}
                  commonPredicates={commonPredicates}
                  comparePredicates={Predicate.predComparison}
                  text="Your Entities"
                />
              </div>
              <div className="bg-slate-400 dark:bg-slate-600 w-full my-6 mx-0 lg:mx-6 lg:my-0 h-[1px] lg:w-[1px] lg:h-full"></div>
              <div className="flex lg:h-full h-[calc(50%-1.532rem)] lg:w-1/2 w-full flex-col gap-4 relative">
                <CompareTextFormulaContainer
                  terms={terms}
                  formula={unit2.characterization || new Formula([])}
                  commonPredicates={commonPredicates}
                  comparePredicates={Predicate.predComparison}
                  text="New Entities"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-row w-full justify-center gap-8">
                <AuxButton
                  text="Close"
                  icon={
                    "M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  }
                  callback={closeMe}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
