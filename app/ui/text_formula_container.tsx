"use client";

import { useState } from "react";
import { Formula, Predicate, Term, TermType } from "../models/models";
import { useRouter } from "next/navigation";

export default function TextFormulaContainer({
  formula,
  terms,
  seeMore,
  exploreVar,
  toAggregate = false
}: {
  formula: Formula;
  terms: Term[];
  seeMore: (t: Term) => void;
  exploreVar: (predicates: string[], boundVar: Term) => void;
  toAggregate?:boolean
}) {
  const router = useRouter();

  const [rawChecked, setRawChecked] = useState(false);
  const internalFormula = formula.spread()

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

  const elements = internalFormula.predicates
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
      const termComp = p.terms.map((t) => {
        if (t.type == TermType.CONSTANT) {
          let full_term = terms.find((tmp) => {
            return t.name[0] == tmp.name[0];
          });

          return (
            <div
              className="transition-all cursor-pointer underline underline-offset-4 font-bold hover:text-slate-400"
              onClick={() => {
                router.push("/" + t.name[0]);
              }}
            >
              <span>
                {normalizeString(full_term?.babelNetEntity?.main_sense || "")}
              </span>
            </div>
          );
        } else if (t.type == TermType.AGGREGATED_TERM) {
          let full_term = terms.find((tmp) => {
            return t.name[0] == tmp.name[0];
          });
          return (
            <div
              className="transition-all cursor-pointer underline underline-offset-4 font-bold hover:text-slate-400"
              onClick={() => {
                seeMore(t);
              }}
            >
              <span>
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
            <div
              className="transition-all cursor-pointer underline underline-offset-4 font-bold hover:text-slate-400"
              onClick={() => {
                exploreVar([p.name], t);
              }}
            >
              <span>?y{storedVar.id}</span>
            </div>
          );
        } else {
          return (
            <div className="font-bold">
              <span>Your entities</span>
            </div>
          );
        }
      });

      return (
        <>
          <div className="flex gap-3 items-center flex-wrap">
            <div>{termComp[0]}</div>
            <span>
              - {normalizePredicateName(p.name)} -{">"}
            </span>
            <div>{termComp[1]}</div>
          </div>
        </>
      );
    });

  let mappedPredicates = 0;

  let rawQuery;
  if(internalFormula.predicates[0].terms[0].type == TermType.FREE_VARIABLE) {
    rawQuery = [
      <span>x {"<-"}</span>,
      ...internalFormula.predicates
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
        .map((p) => {
          const termComp = p.terms.map((t) => {
            if (t.type == TermType.CONSTANT) {
              return t.name[0];
            } else if (t.type == TermType.AGGREGATED_TERM) {
              if (t.name.length <= 3) {
                return t.name.slice(0, 3).join("_");
              } else {
                return (
                  t.name.slice(0, 2).join("_") + "..." + t.name[t.name.length - 1]
                );
              }
            } else if (t.type == TermType.BOUND_VARIABLE) {
              let storedVar = foundVars.find((v) => {
                return v.name == t.name.join(",");
              });
              let name = "y" + storedVar.id;
              return name;
            } else {
              return "x";
            }
          });
  
          let predName = p.name;
  
          mappedPredicates++;
  
          return (
            <span className="text-wrap break-all">
              {"" +
                predName +
                "(" +
                termComp[0] +
                ", " +
                termComp[1] +
                ")" +
                (mappedPredicates < internalFormula.predicates.length ? "," : ".")}
            </span>
          );
        }),
    ];
  }
  else {
    rawQuery = internalFormula.predicates
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
        .map((p) => {
          const termComp = p.terms.map((t) => {
            if (t.type == TermType.CONSTANT) {
              return t.name[0];
            } else if (t.type == TermType.AGGREGATED_TERM) {
              if (t.name.length <= 3) {
                return t.name.slice(0, 3).join("_");
              } else {
                return (
                  t.name.slice(0, 2).join("_") + "..." + t.name[t.name.length - 1]
                );
              }
            } else if (t.type == TermType.BOUND_VARIABLE) {
              let storedVar = foundVars.find((v) => {
                return v.name == t.name.join(",");
              });
              let name = "y" + storedVar.id;
              return name;
            } else {
              return "x";
            }
          });
  
          let predName = (p.is_deriv ? "DERIV#" : "") + p.name;
  
          mappedPredicates++;
  
          return (
            <span className="text-wrap break-all">
              {"" +
                predName +
                "(" +
                termComp[0] +
                ", " +
                termComp[1] +
                ")" +
                (mappedPredicates < internalFormula.predicates.length ? "," : ".")}
            </span>
          );
        });
  }
  

  return (
    <>
      <div
        className={
          "w-full h-full flex flex-col pt-6 overflow-y-scroll text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800" +
          (!rawChecked ? " gap-8" : " gap-2 font-mono")
        }
      >
        <label
          className={
            "inline-flex w-fit items-center cursor-pointer" +
            (rawChecked ? " mb-6" : "")
          }
        >
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={rawChecked}
            onChange={() => {
              setRawChecked(!rawChecked);
            }}
          />
          <div className="transition-colors relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[1.8px] after:start-[2.35px] dark:after:bg-slate-200 after:bg-slate-500 dark:after:border-slate-200 after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-unical-red-200 dark:peer-checked:bg-unical-red-800"></div>
          <span className="ms-4 font-sans font-semibold text-slate-500 dark:text-slate-400">
            Raw query
          </span>
        </label>
        {!rawChecked && elements}
        {rawChecked && rawQuery}
      </div>
    </>
  );
}
