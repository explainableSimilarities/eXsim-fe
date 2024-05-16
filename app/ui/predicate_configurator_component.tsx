import { AdvancedPredicateConfigurator, Term } from "../models/models";
import Slider from "./slider";

export default function PredicateConfiguratorComponent({
  p,
  setPredicateConfig,
  predicateNameBeautifier,
}: {
  p: AdvancedPredicateConfigurator;
  setPredicateConfig: (
    predicateName: string,
    left: Term,
    config: 0 | 1 | 2 | 3
  ) => void;
  predicateNameBeautifier: (name: string) => string;
  termBeautifier: (term: Term) => string;
}) {
  const sliderTypes = (p: AdvancedPredicateConfigurator) => {
    if (p.predicateName == "HYPER") {
      return (
        <>
          <Slider
            name={p.predicateName}
            left={p.left}
            defaultValue={p.overallStatus * 4}
            steps={4}
            callback={setPredicateConfig}
          />
        </>
      );
    } else if (p.wholePredicate.length == 0) {
      return (
        <>
          <Slider
            name={p.predicateName}
            left={p.left}
            defaultValue={p.overallStatus * 6}
            steps={2}
            callback={setPredicateConfig}
          />
        </>
      );
    } else if (p.wholePredicate.length > 0) {
      return (
        <>
          <Slider
            name={p.predicateName}
            left={p.left}
            defaultValue={p.overallStatus * 6}
            steps={3}
            callback={setPredicateConfig}
          />
        </>
      );
    }
  };

  const mySlider = sliderTypes(p);

  return (
    <>
      <div className="select-none transition-all flex flex-col items-center md:items-begin justify-between font-semibold text-slate-600 dark:text-slate-300 md:max-w-[18rem] max-w-[90%] w-full bg-white dark:bg-slate-800 py-4 px-4 border border-slate-300 dark:border-slate-600 rounded-lg">
        <div className="flex flex-col justify-between w-full mb-4">
          <span className="text-align-top text-transparent text-lg md:text-xl font-bold bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400 w-full text-nowrap text-ellipsis">
            {predicateNameBeautifier(p.predicateName).length > 25 ? predicateNameBeautifier(p.predicateName).substring(0, 25) + "..." : predicateNameBeautifier(p.predicateName)}
          </span>
          <div className="md:gap-4 mt-2">
            {mySlider}
            {

            }
          </div>
        </div>
      </div>
    </>
  );
}
