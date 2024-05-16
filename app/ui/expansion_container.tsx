"use client";

import EntityListComponent from "./entity_list_component";
import EntityConfiguratorComponent from "./entity_configurator_component";
import Button from "./button";
import {
  AdvancedPredicateConfigurator,
  EntitySummary,
  Formula,
  Term,
  Unit,
} from "../models/models";

export default function ExpansionContainer({
  unit,
  essential,
  results,
  predicateConfig,
  setPredicateConfig,
  predicateBeautifier,
  termBeautifier,
  isDefault,
  lastPage,
  lastCalled,
  allFetched,
  loadingExpansion,
  update,
  updateQuery,
}: {
  unit: Unit;
  essential: Term[];
  results: Term[];
  predicateConfig: AdvancedPredicateConfigurator[];
  setPredicateConfig: (
    predicateName: string,
    left: Term,
    _config: 0 | 1 | 2 | 3
  ) => void;
  showModalCallback: () => void;
  predicateBeautifier: (name: string) => string;
  termBeautifier: (term: Term) => string;
  isDefault: boolean;
  lastPage: number;
  lastCalled: number;
  allFetched: boolean;
  loadingExpansion: boolean;
  update: () => void;
  updateQuery: (query: Formula) => void;
}) {
  const entitySummaries: EntitySummary[] = [];
  unit.entities.forEach((u: EntitySummary) => {
    entitySummaries.push(u);
  });

  return (
    <>
      <div className={"h-full flex-grow pb-[13.5rem] md:pb-[21.5rem]"}>
        <EntityListComponent
          caller="/dashboard"
          title="Similar Entities"
          initialEntities={unit.entities.flatMap((u) => u.entity)}
          similarEntities={isDefault ? essential : results}
          isDefault={isDefault}
          loadingExpansion={loadingExpansion}
          lastPage={lastPage}
          lastCalled={lastCalled}
          allFetched={allFetched}
          update={update}
        />
      </div>

      <div
        className={
          "h-48 md:h-80 absolute bottom-7 overflow-x-hidden overflow-y-scroll flex flex-col text-slate-600 dark:text-slate-300 w-[calc(100%-4rem)] md:w-[calc(100%-8.5rem)] bg-white dark:bg-slate-800 py-4 px-5 border border-slate-300 dark:border-slate-600 rounded-lg"
        }
      >
        <div className="flex flex-wrap justify-between items-center gap-8">
          <div className="">
            <span className="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300">
              Expand Relaxing some atom 
            </span>
          </div>
          <div className="flex flex-wrap gap-8 space-between">
            <Button
              text="Apply"
              icon={
                "M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
              }
              callback={updateQuery}
            />
          </div>
        </div>

        <EntityConfiguratorComponent
          predicateConfig={predicateConfig}
          setPredicateConfig={setPredicateConfig}
          predicateNameBeautifier={predicateBeautifier}
          termBeautifier={termBeautifier}
        />
      </div>
    </>
  );
}
