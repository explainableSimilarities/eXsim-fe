"use client";

import { useState } from "react";
import { Formula, Predicate, Term, TermType } from "../models/models";
import { useRouter } from "next/navigation";

export default function CompareTextFormulaContainer({
  formula,
  terms,
  commonPredicates,
  text,
  comparePredicates,
}: {
  formula: Formula;
  terms: Term[];
  commonPredicates: Predicate[];
  text: string;
  comparePredicates: (p1: Predicate, p2: Predicate) => boolean;
}) {
  function normalizeString(mainSense: string) {
    mainSense = mainSense.replaceAll("_", " ");
    return mainSense.charAt(0).toUpperCase() + mainSense.slice(1);
  }

  function normalizePredicateName(str: string) {
    if (str == "HYPER") return "is a";

    str = str.replaceAll("_", " ");
    return str.toLowerCase();
  }

  let boundVars = 0;
  let foundVars: any[] = [];
  let predTerms: any[] = [];

  const elements = formula.predicates
    .sort((a, b) => {
      let aVar = a.terms[1].type == TermType.BOUND_VARIABLE;
      let bVar = b.terms[1].type == TermType.BOUND_VARIABLE;

      if (aVar == bVar) {
        return 0;
      } else if (!aVar) {
        return -1;
      } else {
        return 1;
      }
    })
    .reduce((result, pred) => {
      let found = result.find((p) => {
        return (
          p.name == pred.name &&
          p.terms[1].name.join(",") == pred.terms[1].name.join(",")
        );
      });
      if (!found) {
        result.push(pred);
      }
      return result;
    }, [] as Predicate[])
    .map((p) => {
      const inCommon: boolean = commonPredicates.find((cp) => {
        return comparePredicates(p, cp);
      })
        ? true
        : false;
      const termComp = p.terms.map((t) => {
        if (t.type == TermType.CONSTANT) {
          let full_term = terms.find((tmp) => {
            return t.name[0] == tmp.name[0];
          });

          return (
            <div className="transition-all font-bold ">
              <span
                className={
                  "" +
                  (inCommon
                    ? "font-bold dark:text-green-400 text-green-600"
                    : "")
                }
              >
                {normalizeString(full_term?.babelNetEntity?.main_sense || "")}
              </span>
            </div>
          );
        } else if (t.type == TermType.AGGREGATED_TERM) {
          let full_term = terms.find((tmp) => {
            return t.name[0] == tmp.name[0];
          });
          return (
            <div className="transition-all font-bold ">
              <span
                className={
                  "" +
                  (inCommon
                    ? "font-bold dark:text-green-400 text-green-600"
                    : "")
                }
              >
                {normalizeString(full_term?.babelNetEntity?.main_sense || "")}
                <span className="node-others">
                  {" "}
                  and {t.name.length - 1} more
                </span>
              </span>
            </div>
          );
        } else if (t.type == TermType.BOUND_VARIABLE) {
          let storedVar = foundVars.find((v) => {
            return v.name == t.name.join(",");
          });

          if (!storedVar) {
            storedVar = { name: t.name.join(","), id: boundVars++ };
            foundVars.push(storedVar);
          }

          return (
            <div className="transition-all font-bold ">
              <span
                className={
                  "" +
                  (inCommon
                    ? "font-bold dark:text-green-400 text-green-600"
                    : "")
                }
              >
                ?y{storedVar.id}
              </span>
            </div>
          );
        } else {
          return (
            <div className="font-bold">
              <span
                className={
                  "" +
                  (inCommon
                    ? "font-bold dark:text-green-400 text-green-600"
                    : "")
                }
              >
                {text}
              </span>
            </div>
          );
        }
      });
      return (
        <>
          <div className="flex gap-3 items-center flex-wrap">
            <div>{termComp[0]}</div>
            <span
              className={
                "" +
                (inCommon ? "font-bold dark:text-green-400 text-green-600" : "")
              }
            >
              - {normalizePredicateName(p.name)} -{">"}
            </span>
            <div>{termComp[1]}</div>
          </div>
        </>
      );
    });

  return (
    <>
      <div
        className={
          "h-full w-full overflow-y-scroll flex flex-col pt-6 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 gap-8"
        }
      >
        {elements}
      </div>
    </>
  );
}
