"use client";

import Button from "./button";
import AuxButton from "./aux_button";
import { AdvancedPredicateConfigurator } from "../models/models";
import { Predicate, Term } from "../models/models";

export default function AdvancedGroupedOptionsOptionsExpansionModal({
  groupedConfig,
  confirmCallback,
  exitCallback,
  updateAdvancedConfigCallback,
  predicateNameBeautifier,
  termBeautifier,
}: {
  groupedConfig: AdvancedPredicateConfigurator[];
  confirmCallback: () => void;
  exitCallback: () => void;
  updateAdvancedConfigCallback: (
    index: number,
    right: Predicate | undefined,
    value: boolean
  ) => void;
  predicateNameBeautifier: (name: string) => string;
  termBeautifier: (term: Term) => string;
}) {
  const elements = groupedConfig.map((element, index) => {
    return (
      <>
        <div
          key={index}
          className="flex flex-col w-64 h-80 py-4 pl-2 md:pl-4 pr-2 md:flex-col md:gap-4 border border-slate-300 dark:border-slate-600 rounded-lg justify-items-center"
        >
          <div className="text-align-top text-transparent text-lg md:text-xl font-bold bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400 w-fit">
            {predicateNameBeautifier(element.predicateName) +
              "( " +
              termBeautifier(element.left) +
              ", ... )"}
          </div>
          <div className="pt-2 pr-4 overflow-y-scroll">
            <ul className="font-semibold">
              {element.wholePredicate.map((p: Predicate, id2) => {
                return (
                  <li className="w-full px-4 overflow-hidden ">
                    <div className="flex items-center">
                      <input
                        id={id2.toString()}
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded"
                        checked={element.checkedRights[id2]}
                        onChange={(e) => {
                          e.target.checked = !e.target.checked;
                          const newBool = !element.checkedRights[id2];
                          updateAdvancedConfigCallback(index, p, newBool);
                        }}
                      />
                      <label className="w-full py-3 ms-2 text-md font-bold text-slate-600 dark:text-slate-300 overflow-hidden text-nowrap text-ellipsis">
                        {termBeautifier(p.terms[1])}
                      </label>
                    </div>
                  </li>
                );
              })}
              <li className="w-full px-4 overflow-hidden ">
                <div className="flex items-center">
                  <input
                    id="-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded"
                    disabled={element.checkedRights.some((e) => e)}
                    checked={
                      element.introduceBound &&
                      !element.checkedRights.some((e) => e)
                    }
                    onChange={(e) => {
                      e.target.checked = !e.target.checked;
                      const newBool = !element.introduceBound;
                      updateAdvancedConfigCallback(index, undefined, newBool);
                    }}
                  />
                  <label className="w-full py-3 ms-2 text-md font-bold text-slate-600 dark:text-slate-300 overflow-hidden text-nowrap text-ellipsis">
                    y
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  });
  return (
    <>
      <div
        className={
          "select-none transition-all flex flex-col absolute top-[10%] left-[10%] z-50 w-[80%] h-[80%] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 justify-top items-left px-16 py-16 border border-slate-300 dark:border-slate-600 rounded-lg blur:none margin-0"
        }
      >
        <div className="w-full h-full flex flex-col justify-between items-left gap-16">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300 w-fit">
                Advanced Options
              </div>
              <div className="text-lg md:text-lg">
                Select the desired relaxation level of each atom of the formula.
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-start flex-wrap flew-wrap gap-4 px-4 h-[65%] overflow-y-scroll">
            {elements}
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row w-full justify-center gap-8">
              <AuxButton
                text="Exit"
                icon={
                  "M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                }
                callback={exitCallback}
              />
              <Button
                text="Confirm"
                icon={
                  "M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                }
                callback={confirmCallback}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
