"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import GraphComponent from "./graph_component";
import ExpansionContainer from "./expansion_container";
import {
  AdvancedPredicateConfigurator,
  Formula,
  Predicate,
  Query,
  QueryResult,
  SummaryConfig,
  SummaryRequest,
  Term,
  TermType,
  Unit,
} from "../models/models";
import {
  callCharacterize,
  callQuery,
  callSummary,
  callSummaryConfig,
  callSearchByIdBatched,
  callTransitiveRelaxer,
} from "../middleware/api";

export default function ExpansionPageContainer() {
  const [unit, setUnit] = useState(new Unit([], null));
  const [nexusTerms, setNexusTerms] = useState([] as Term[]);
  const [moreNexusTerms, setMoreNexusTerms] = useState([] as Term[]);
  const [results, setResults] = useState([] as Term[]);
  const [query, setQuery] = useState(new Formula([]));
  const [groupedConfig, setGroupedConfig] = useState(
    [] as AdvancedPredicateConfigurator[]
  );
  const [defaultGroupedConfig, setDefaultGroupedConfig] = useState(
    [] as AdvancedPredicateConfigurator[]
  );

  const router = useRouter();
  const [loading, setLoading] = useState(true); // Riportare a True
  const [nexusLoading, setNexusLoading] = useState(true);
  const [resultExpanded, setResultExpanded] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [trigger, setTrigger] = useState(true);

  const [loadingExpansion, setLoadingExpansion] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [allFetched, setAllFetched] = useState(false);

  const [lastPage, setLastPage] = useState(0);
  const [lastCalled, setLastCalled] = useState(-1);

  const [isDefaultFormula, setIsDefaultFormula] = useState(true);

  function normalizePredicateName(str: string) {
    if (str == "HYPER") return "is a";

    str = str.replaceAll("_", " ");
    return str.toLowerCase();
  }
  function normalizeString(mainSense: string) {
    mainSense = mainSense.replaceAll("_", " ");
    return mainSense.charAt(0).toUpperCase() + mainSense.slice(1);
  }

  const checkForNexusTerms = (term: Term): string => {
    if (!term) {
      throw new Error("Shamalaia exception");
    }
    if (term.type == TermType.BOUND_VARIABLE) {
      return "?";
    } else if (term.type == TermType.FREE_VARIABLE) {
      return "X";
    } else {
      const corresponding: Term | undefined = nexusTerms.find(
        (t) => JSON.stringify(t.name) === JSON.stringify(term.name)
      );
      if (corresponding && corresponding.babelNetEntity) {
        return normalizeString(corresponding.babelNetEntity.main_sense);
      } else {
        throw new Error("Shamalaia exception");
      }
    }
  };

  const toggleResult = () => {
    setResultExpanded(!resultExpanded);
    setTrigger(!trigger);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const toggleTrigger = () => {
    setTrigger(!trigger);
  };

  const executeQuery = (
    q: Formula,
    page: number,
    concat: boolean,
    ie: Term[]
  ): void => {
    setLastCalled(page);
    callQuery(new Query(q, true, page), "").then((res) => {
      if (res instanceof QueryResult) {
        const names: string[] = res.results.map((r) => r.name[0]);
        callSearchByIdBatched(names, "").then((batched) => {
          if (!(batched instanceof Number)) {
            let tmp = batched as Term[];
            if (tmp.length < 20) {
              setAllFetched(true);
            }

            tmp = tmp.filter(
              (t) =>
                !ie.some(
                  (r) => JSON.stringify(r.name) == JSON.stringify(t.name)
                )
            );

            updateResults(tmp, concat);
            setLoadingExpansion(false);
            setLastPage(page + 1);
          }
        });
      }
      setNexusLoading(false);
    });
  };

  function update(
    q: Formula,
    ie: Term[],
    concat: boolean = false,
    page: number | undefined = undefined
  ) {
    const newResults = [] as Term[];

    results.forEach((r) => {
      newResults.push(r);
    });

    if (page == undefined && lastCalled < lastPage) {
      executeQuery(q, lastPage, concat, ie);
    } else if (page != undefined) {
      executeQuery(q, page, concat, ie);
    }
  }

  const updateFromDefault = () => {
    let ie: Term[] = [];
    unit.entities.forEach((e) => {
      ie = ie.concat(e.entity);
    });
    update(query, ie, true);
  };

  const updateResults = (_results: Term[], concat: boolean = false) => {
    let newResults = [] as Term[];
    if (concat) {
      results.forEach((r) => {
        newResults.push(r);
      });
    }
    _results.forEach((r) => {
      newResults.push(r);
    });
    setResults(newResults);
  };

  const resetResults = () => {
    setResults([] as Term[]);
    setLastPage(0);
    setLastCalled(-1);
    setAllFetched(false);
    setLoadingExpansion(true);
  };

  const newQueryFromGroupedConfig = (): void => {
    setNexusLoading(true);
    let newQuery = new Formula([]);
    groupedConfig.forEach((element) => {
      if (element.predicateName != "HYPER") {

        if (element.overallStatus == 1) {
          newQuery.predicates.push(element.template_p);
        } else if (element.overallStatus == 0) {
          element.wholePredicate.forEach((p, index) => {

            newQuery.predicates.push(p);


          });
          if (
 element.introduceBound) {
            newQuery.predicates.push(element.template_p);
          }
        }
      } else {
        element.relaxationLevels[element.overallStatus].forEach((p) => {
          newQuery.predicates.push(p);
        });
      }
    });
    setLastPage(0);
    setLastCalled(-1);
    resetResults();
    updateQuery(newQuery, unit);
    setLoadingExpansion(true);
    isCurrentDefault(groupedConfig);
  };

  const updateQuery = (_query: Formula, _u: Unit) => {
    setQuery(_query);
    let ie: Term[] = [];
    _u.entities.forEach((e) => {
      ie = ie.concat(e.entity);
    });
    update(_query, ie, false, 0);
  };

  const buildIsaConfig = (
    p: Predicate,
    isaConfig: AdvancedPredicateConfigurator | null
  ): AdvancedPredicateConfigurator | null => {
    if (isaConfig !== null) {
      if (p.terms[1].type == TermType.CONSTANT) {
        isaConfig.addPredicate(p);
      } else if (p.terms[1].type == TermType.BOUND_VARIABLE) {
        isaConfig.hasBound = true;
        isaConfig.introduceBound = true;
      }
    } else {
      const tmpRight = [] as Predicate[];
      let introduceBound = false;
      if (p.terms[1].type == TermType.CONSTANT) {
        tmpRight.push(
          new Predicate(
            p.type,
            p.name,
            p.terms.map((t) => new Term(t.name, t.type)),
            p.is_deriv
          )
        );
      } else if (p.terms[1].type === TermType.BOUND_VARIABLE)
        introduceBound = true;
      isaConfig = new AdvancedPredicateConfigurator(
        p.name,
        p,
        p.terms[0],
        tmpRight,
        tmpRight.map(() => true),
        introduceBound,
        introduceBound,
        tmpRight.map(() => true),
        0,
        [[], [], [], []]
      );
    }
    return isaConfig;
  };

  const buildGenericConfig = (
    p: Predicate,
    configs: AdvancedPredicateConfigurator[]
  ): AdvancedPredicateConfigurator[] => {
    let found = false;
    configs.forEach((element) => {
      if (
        !found &&
        element.predicateName == p.name &&
        JSON.stringify(element.left.name) == JSON.stringify(p.terms[0].name)
      ) {
        if (p.terms[1].type == TermType.CONSTANT) {
          element.addPredicate(p);
        } else if (p.terms[1].type == TermType.BOUND_VARIABLE) {
          element.hasBound = true;
          element.introduceBound = true;
        }

        found = true;
      }
    });
    if (!found) {
      const tmpRight = [] as Predicate[];
      let introduceBound = false;
      if (p.terms[1].type == TermType.CONSTANT) {
        tmpRight.push(
          new Predicate(
            p.type,
            p.name,
            p.terms.map((t) => new Term(t.name, t.type)),
            p.is_deriv
          )
        );
      } else if (p.terms[1].type === TermType.BOUND_VARIABLE)
        introduceBound = true;
      configs.push(
        new AdvancedPredicateConfigurator(
          p.name,
          p,
          p.terms[0],
          tmpRight,
          tmpRight.map(() => true),
          introduceBound,
          introduceBound,
          tmpRight.map(() => true),
          0,
          [[], [], [], []]
        )
      );
    }

    return configs;
  };

  const initGroupedConfig = (characterization: Formula) => {
    let configs: AdvancedPredicateConfigurator[] = [];
    let isaConfig: AdvancedPredicateConfigurator | null = null;
    let newNexusTerms: Term[] = [];
    characterization.predicates.forEach((p) => {
      if (p.name == "HYPER") {
        isaConfig = buildIsaConfig(p, isaConfig);
      } else {
        configs = buildGenericConfig(p, configs);
      }
    });

    configs.forEach((element) => {
      const left = element.left;
      let rights = element.wholePredicate;
      unit.characterization?.predicates.forEach((p) => {
        if (JSON.stringify(left.name) == JSON.stringify(p.terms[1].name)) {
          element.isLeftSource = false;
        }
        rights.forEach((r, index) => {
          if (JSON.stringify(r.name) == JSON.stringify(p.terms[0].name)) {
            element.isRightTerminal[index] = false;
          }
        });
      });
    });
    setGroupedConfig(configs);
    setDefaultGroupedConfig(configs);
    if (isaConfig !== null) {
      const isaConfigTmp: AdvancedPredicateConfigurator = isaConfig;
      callTransitiveRelaxer(isaConfigTmp.wholePredicate, "").then((res) => {
        if (res instanceof Array) {
          const hierarchy = res as Predicate[][];
          hierarchy.forEach((f) => {
            f.forEach((p) => {
              p.terms.forEach((t) => {
                if (t.type === TermType.CONSTANT) {
                  newNexusTerms.push(t);
                }
              });
            });
          });
          isaConfigTmp.relaxationLevels = hierarchy;
          setMoreNexusTerms(moreNexusTerms.concat(newNexusTerms));
          setGroupedConfig([isaConfigTmp].concat(configs));
          setDefaultGroupedConfig([isaConfigTmp].concat(configs));
        }
      });
    }
  };

  const isCurrentDefault = (gc: AdvancedPredicateConfigurator[]) => {
    let def = true;
    for (let i = 0; i < gc.length; i++) {
      if (gc[i].overallStatus != defaultGroupedConfig[i].overallStatus) {
        def = false;
        break;
      }
    }
    setIsDefaultFormula(def);
  };

  const updateAllByLeftAndName = (
    predicateName: string,
    left: Term,
    value: 0 | 1 | 2 | 3
  ) => {
    let newGroupedConfig = [] as AdvancedPredicateConfigurator[];
    groupedConfig.forEach((element) => {
      newGroupedConfig.push(
        new AdvancedPredicateConfigurator(
          element.predicateName,
          element.template_p,
          element.left,
          element.wholePredicate,
          element.checkedRights,
          element.hasBound,
          element.introduceBound,
          element.isRightTerminal,
          element.overallStatus,
          element.relaxationLevels
        )
      );
    });
    newGroupedConfig.forEach((element) => {
      if (
        element.predicateName === predicateName &&
        JSON.stringify(element.left.name) == JSON.stringify(left.name)
      ) {
        element.changeStatus(value);
      }
    });
    setGroupedConfig(newGroupedConfig);
  };

  useEffect(() => {
    if (!localStorage.getItem("lastUnit")) {
      router.push("/");
    } else {
      localStorage.setItem("lastPage", "/expansion");
      let stored_unit = Unit.fromJson(
        JSON.parse(localStorage.getItem("lastUnit") || "")
      );
      setUnit(stored_unit);

      if (stored_unit.entities[0].summary.atoms.predicates.length == 0) {
        callSummaryConfig(stored_unit, "").then((sum) => {
          if (sum instanceof SummaryConfig) {
            sum.beautify = true;
            callSummary(
              new SummaryRequest(stored_unit, sum as SummaryConfig),
              ""
            ).then((u) => {
              if (u instanceof Unit) {
                localStorage.setItem("lastUnit", JSON.stringify(u));
                setUnit(u);
                setLoading(false);
                callCharacterize(u, "").then((uFull) => {
                  if (uFull instanceof Unit) {
                    localStorage.setItem("lastUnit", JSON.stringify(uFull));
                    setUnit(uFull);
                    if (uFull.characterization) {
                      const int_query = uFull.characterization.spread();
                      setNexusTerms(
                        uFull.entities[0].summary.terms.map((t) => {
                          return t.full_repr || new Term([], TermType.CONSTANT);
                        })
                      );
                      setNexusLoading(false);
                      setQuery(int_query);
                      initGroupedConfig(int_query);
                      let ie: Term[] = [];
                      uFull.entities.forEach((e) => {
                        ie = ie.concat(e.entity);
                      });
                      update(int_query, ie, true);
                    }
                  }
                });
              }
            });
          }
        });
      } else {
        setLoading(false);
        if (
          !stored_unit.characterization ||
          stored_unit.characterization.predicates.length == 0
        ) {
          callCharacterize(stored_unit, "").then((uFull) => {
            if (uFull instanceof Unit) {
              localStorage.setItem("lastUnit", JSON.stringify(uFull));
              setUnit(uFull);
              if (uFull.characterization) {
                const int_query = uFull.characterization.spread();
                setNexusTerms(
                  uFull.entities[0].summary.terms.map((t) => {
                    return t.full_repr || new Term([], TermType.CONSTANT);
                  })
                );
                setNexusLoading(false);
                setQuery(int_query);
                let ie: Term[] = [];
                stored_unit.entities.forEach((e) => {
                  ie = ie.concat(e.entity);
                });
                update(int_query, ie, true);
              }
            }
          });
        } else {
          let int_query = stored_unit.characterization.spread();
          setNexusTerms(
            stored_unit.entities[0].summary.terms.map((t) => {
              return t.full_repr || new Term([], TermType.CONSTANT);
            })
          );
          setNexusLoading(false);
          setQuery(int_query);

          initGroupedConfig(int_query);
          let ie: Term[] = [];
          stored_unit.entities.forEach((e) => {
            ie = ie.concat(e.entity);
          });
          update(int_query, ie, true);
        }
      }
    }
  }, []);

  const switchAdvancedOptions = () => {
    setShowModal(!showModal);
  };

  if (loading) {
    return (
      <>
        <div
          className={"flex flex-col w-full items-center p-12 md:py-32 lg:p-32"}
        >
          <div className={"flex items-center w-full flex-wrap flex-col"}>
            <h1
              className={
                "transition-all font-sans font-extrabold antialiased text-transparent bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400 text-5xl md:text-6xl"
              }
            >
              neXSim
            </h1>
            <Spinner />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Navbar
          resultExpanded={resultExpanded}
          sidebarExpanded={sidebarExpanded}
          toggleResult={toggleResult}
          toggleSidebar={toggleSidebar}
        />
        <div className={"flex w-full h-screen"}>
          <div
            className={
              "flex w-8/12 relative grow" +
              (!resultExpanded ? " show" : " hidden")
            }
          >
            <Sidebar
              sidebarExpanded={sidebarExpanded}
              toggleSidebar={toggleSidebar}
              unitEntities={unit.entities}
              selected={""}
            />

            <div
              className={
                "transition-all h-full flex-column md:w-10/12 grow flex-wrap py-6 pl-8 md:pl-[6.5rem] pr-8 pt-[8rem] md:pt-[2rem]" +
                (sidebarExpanded ? " hidden" : " w-full")
              }
            >
              <ExpansionContainer
                unit={unit}
                essential={results}
                results={results}
                predicateConfig={groupedConfig}
                lastPage={lastPage}
                allFetched={allFetched}
                lastCalled={lastCalled}
                loadingExpansion={loadingExpansion}
                isDefault={isDefaultFormula}
                predicateBeautifier={normalizePredicateName}
                termBeautifier={checkForNexusTerms}
                setPredicateConfig={updateAllByLeftAndName}
                showModalCallback={switchAdvancedOptions}
                update={updateFromDefault}
                updateQuery={newQueryFromGroupedConfig}
              />
            </div>
          </div>
          {!loading && (
            <GraphComponent
              trigger={trigger}
              toggleTrigger={toggleTrigger}
              resultExpanded={resultExpanded}
              toggleResult={toggleResult}
              formula={query}
              terms={nexusTerms.concat(moreNexusTerms)}
              dataLoading={nexusLoading}
              nodeLimit={-1}
            />
          )}
        </div>
      </>
    );
  }
}
