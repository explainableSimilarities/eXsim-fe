import { Term, AdvancedPredicateConfigurator } from "../models/models";
import PredicateConfiguratorComponent from "./predicate_configurator_component";
export default function EntityConfiguratorComponent({
  predicateConfig,
  setPredicateConfig,
  predicateNameBeautifier,
  termBeautifier,
}: {
  predicateConfig: AdvancedPredicateConfigurator[];
  setPredicateConfig: (
    predicateName: string,
    left: Term,
    config: 0 | 1 | 2 | 3
  ) => void;
  predicateNameBeautifier: (name: string) => string;
  termBeautifier: (term: Term) => string;
}) {
  return (
    <>
      <div className="w-full flex">
        <div className="grow">
          <div className="w-full items-center flex flex-wrap justify-between">
            <div className="transition-all flex w-full flex-wrap gap-4 pt-4">
              {predicateConfig.map((p, i) => {
                return (
                  <PredicateConfiguratorComponent
                    p={p}
                    setPredicateConfig={setPredicateConfig}
                    predicateNameBeautifier={predicateNameBeautifier}
                    termBeautifier={termBeautifier}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
