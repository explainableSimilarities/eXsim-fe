"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import GraphComponent from "./graph_component";
import {
  ListOfUnit,
  Formula,
  SummaryConfig,
  SummaryRequest,
  Term,
  TermType,
  Unit,
  UnitRelation,
  UnitRelationType,
  EntitySummary,
  SuperclassesRequest,
  Predicate,
} from "../models/models";
import {
  callCharacterize,
  callCheckSuperclasses,
  callCompare,
  callSummary,
  callSummaryConfig,
} from "../middleware/api";
import CompareSearchComponent from "./compare_search_component";
import EntityComparisonComponent from "./entity_comparison_component";
export default function ComparePageContainer() {
  const [unit, setUnit] = useState(new Unit([], null));
  const [nexusTerms, setNexusTerms] = useState([] as Term[]);
  const [firstUnit, setFirstUnit] = useState(new Unit([], null));
  const [firstNexusTerms, setFirstNexusTerms] = useState([] as Term[]);
  const [secondUnit, setSecondUnit] = useState(new Unit([], null));
  const [secondNexusTerms, setSecondNexusTerms] = useState([] as Term[]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [nexusLoading, setNexusLoading] = useState(true);
  const [resultExpanded, setResultExpanded] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [trigger, setTrigger] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(0);

  const [confirmedComparison, setConfirmedComparison] = useState(false);

  const [unitRelation, setUnitRelation] = useState(
    undefined as UnitRelationType | undefined
  );

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

  const computeSuperclasses = (
    u: Unit
  ): {
    "predname": string;
    "superclasses": string[];
    "template": Predicate;
  }[] => {
    const unit_superclasses: {
      "predname": string;
      "superclasses": string[];
      "template": Predicate;
    }[] = [];
    u.characterization?.predicates.forEach((p) => {
      if (p.is_deriv || p.name === "HYPER") {
        let found_p: boolean = false;
        unit_superclasses.forEach((a) => {
          if (a.predname === p.name && !found_p) {
            found_p = true;
            if (
              p.terms[1].name.length === 1 &&
              a.superclasses.indexOf(p.terms[1].name[0]) === -1 &&
              (p.terms[1].type === TermType.CONSTANT ||
                p.terms[1].type === TermType.AGGREGATED_TERM)
            ) {
              a.superclasses.push(p.terms[1].name[0]);
            } else if (
              p.terms[1].name.length > 1 &&
              (p.terms[1].type === TermType.CONSTANT ||
                p.terms[1].type === TermType.AGGREGATED_TERM)
            ) {
              p.terms[1].name.forEach((n) => {
                if (a.superclasses.indexOf(n) === -1) {
                  a.superclasses.push(n);
                }
              });
            }
          }
        });
        if (
          !found_p &&
          (p.terms[1].type === TermType.CONSTANT ||
            p.terms[1].type === TermType.AGGREGATED_TERM)
        ) {
          let new_ancestor = {
            "predname": p.name,
            "superclasses": p.terms[1].name.map((x) => {
              return x;
            }),
            "template": new Predicate(
              p.type,
              p.name,
              p.terms.map((x) => {
                return x;
              }, p.is_deriv)
            ),
          };
          unit_superclasses.push(new_ancestor);
        }
      }
    });

    return unit_superclasses;
  };

  const superclassesDiff = (
    s1: {
      "predname": string;
      "superclasses": string[];
      "template": Predicate;
    }[],
    s2: {
      "predname": string;
      "superclasses": string[];
      "template": Predicate;
    }[]
  ): {
    "predname": string;
    "superclasses": string[];
    "template": Predicate;
  }[] => {

    s1.forEach((a) => {
      s2.forEach((b) => {
        if (a.predname === b.predname) {
          a.superclasses = a.superclasses.filter((c) => {
            return b.superclasses.indexOf(c) === -1;
          });
        }
      });
    });

    return s1;
  };

  const getNewAtomsSinglePredicate = (
    tau: string[],
    predname: string,
    superclasses: string[],
    template: Predicate,
    first: boolean
  ): Promise<{ "origin": boolean; "freshAtoms": Predicate[] }> => {
    if (tau.length == 0) {
      return new Promise((resolve) => {
        resolve({
          "origin": first,
          "freshAtoms": superclasses.map((s) => {
            return new Predicate(
              template.type,
              template.name,
              [template.terms[0], new Term([s], TermType.CONSTANT)],
              template.is_deriv
            );
          }),
        });
      });
    }

    return callCheckSuperclasses(
      new SuperclassesRequest(tau[0], superclasses, predname),
      ""
    ).then((result) => {
      if (result instanceof Array) {
        return {
          "origin": first,
          "freshAtoms": result.map((r) => {
            return new Predicate(
              template.type,
              template.name,
              [template.terms[0], new Term([r], TermType.CONSTANT)],
              template.is_deriv
            );
          }),
        };
      } else {
        return { "origin": first, "freshAtoms": [] };
      }
    });
  };

  const performComparison = (): void => {
    setLoading(true);
    const u0: Unit = Unit.byCopy(unit);
    const u1: Unit = Unit.byCopy(firstUnit);
    const u2: Unit = Unit.byCopy(secondUnit);


    let u1_super = [] as {
      "predname": string;
      "superclasses": string[];
      "template": Predicate;
    }[];
    let u2_super = [] as {
      "predname": string;
      "superclasses": string[];
      "template": Predicate;
    }[];

    const u_1_template: Term | undefined =
      u1.characterization?.predicates[0].terms[0];
    const u_2_template: Term | undefined =
      u2.characterization?.predicates[0].terms[0];

    const tau_1 = u1.entities
      .filter((e) => {
        return !u0.entities.some((u) => {
          return EntitySummary.compareEntitySummary(e, u);
        });
      })
      .map((e) => {
        return e.entity[0].name[0];
      });

    const tau_2 = u2.entities
      .filter((e) => {
        return !u0.entities.some((u) => {
          return EntitySummary.compareEntitySummary(e, u);
        });
      })
      .map((e) => {
        return e.entity[0].name[0];
      });

    const u0_super = computeSuperclasses(u0);

    if (tau_1.length == 0) {
      u2_super = computeSuperclasses(u2);
      u1_super = u0_super;
    } else if (tau_2.length == 0) {
      u1_super = computeSuperclasses(u1);
      u2_super = u0_super;
    } else {
      u1_super = computeSuperclasses(u1);
      u2_super = computeSuperclasses(u2);
      u1_super = superclassesDiff(u1_super, u0_super);
      u2_super = superclassesDiff(u2_super, u0_super);
    }



    if (u_2_template) {
      u1_super.forEach((e) => {
        e.template.terms[0] = new Term(
          u_2_template.name,
          u_2_template.type,
          u_2_template.babelNetEntity
        );
      });
    }
    if (u_1_template) {
      u2_super.forEach((e) => {
        e.template.terms[0] = new Term(
          u_1_template?.name,
          u_1_template?.type,
          u_1_template?.babelNetEntity
        );
      });
    }

    const nfc: Predicate[] = [];
    const nsc: Predicate[] = [];

    let x = [] as Promise<{ "origin": boolean; "freshAtoms": Predicate[] }>[];
    x = u1_super
      .flatMap((e) => {
        return getNewAtomsSinglePredicate(
          tau_2,
          e.predname,
          e.superclasses,
          e.template, // questo è il template della f.v. della seconda unit
          false
        );
      })
      .concat(
        u2_super.flatMap((e) => {
          return getNewAtomsSinglePredicate(
            tau_1,
            e.predname,
            e.superclasses,
            e.template, // questo è il template della f.v. della prima unit
            true
          );
        })
      );

    Promise.all(x).then((mappazzone) => {
      mappazzone.forEach((mappa) => {
        mappa.freshAtoms.forEach((p) => {
          if (mappa.origin === true) {
            console.error(
              `tf: ${
                u_1_template
                  ? u_1_template.babelNetEntity?.main_sense
                  : "undefined"
              }`
            );
            console.error(
              `tf: ${u_1_template ? u_1_template.name[2] : "undefined"}`
            );
            console.error(` f: ${p.terms[0].name[2]}`);
            nfc.push(p);
          } else {
            console.error(
              `ts: ${
                u_2_template
                  ? u_2_template.babelNetEntity?.main_sense
                  : "undefined"
              }`
            );
            console.error(
              `ts: ${u_2_template ? u_2_template.name[2] : "undefined"}`
            );
            console.error(` s: ${p.terms[0].name[2]}`);
            nsc.push(p);
          }
        });
        let newFirst = Unit.byCopy(u1);
        let newSecond = Unit.byCopy(u2);
        newFirst.characterization?.predicates.push(...nfc);
        newFirst.characterization?.predicates.forEach((p) => {
        });

        newSecond.characterization?.predicates.push(...nsc);
        newSecond.characterization?.predicates.forEach((p) => {
        });

        const tmp1 = newFirst.characterization?.spread();
        const tmp2 = newSecond.characterization?.spread();

        newFirst.characterization =
          tmp1 !== undefined ? tmp1 : newFirst.characterization;
        newSecond.characterization =
          tmp2 !== undefined ? tmp2 : newSecond.characterization;

        setFirstUnit(newFirst);
        setSecondUnit(newSecond);
        callCompare(new ListOfUnit([newFirst, newSecond]), "").then(
          (result) => {
            if (result instanceof UnitRelation) {
              const relation: UnitRelationType | undefined = result.relation
                ? result.relation
                : undefined;
              setUnitRelation(relation);
              setLoading(false);
            }
          }
        );
      });
    });
  };

  useEffect(() => {
    if (!localStorage.getItem("lastUnit")) {
      router.push("/");
    } else {
      localStorage.setItem("lastPage", "/dashboard");
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
                      setNexusTerms(
                        uFull.entities[0].summary.terms.map((t) => {
                          return t.full_repr || new Term([], TermType.CONSTANT);
                        })
                      );
                      setNexusLoading(false);
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
                setNexusTerms(
                  uFull.entities[0].summary.terms.map((t) => {
                    return t.full_repr || new Term([], TermType.CONSTANT);
                  })
                );
                setNexusLoading(false);
              }
            }
          });
        } else {
          setNexusTerms(
            stored_unit.entities[0].summary.terms.map((t) => {
              return t.full_repr || new Term([], TermType.CONSTANT);
            })
          );
          setNexusLoading(false);
        }
      }
    }
  }, []);

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
        <div
          className={
            "flex w-full md:h-screen" + (sidebarExpanded ? " h-screen" : "")
          }
        >
          <div
            className={
              "flex w-5/12 relative grow" +
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
                "transition-all flex flex-col md:w-10/12 grow pb-6 pt-28 md:pt-6 pl-8 md:pl-[6.5rem] pr-8 overflow-y-scroll overflow-x-hidden" +
                (sidebarExpanded ? " hidden" : " w-full")
              }
            >
              {!confirmedComparison && (
                <CompareSearchComponent
                  actualUnit={unit}
                  first={firstUnit}
                  updateFirstNexusTerms={setFirstNexusTerms}
                  second={secondUnit}
                  updateSecondNexusTerms={setSecondNexusTerms}
                  updateFirst={setFirstUnit}
                  updateSecond={setSecondUnit}
                  compareCallback={() => {
                    setConfirmedComparison(true);
                    performComparison();
                  }}
                />
              )}
              {confirmedComparison && (
                <EntityComparisonComponent
                  actualUnit={unit}
                  first={firstUnit}
                  second={secondUnit}
                  selectedUnit={selectedUnit}
                  setSelectedUnit={setSelectedUnit}
                  relation={unitRelation || UnitRelationType.INC}
                />
              )}
            </div>
          </div>
          {selectedUnit == 0 && (
            <GraphComponent
              trigger={trigger}
              toggleTrigger={toggleTrigger}
              resultExpanded={resultExpanded}
              toggleResult={toggleResult}
              formula={unit.characterization || new Formula([])}
              terms={nexusTerms}
              dataLoading={nexusLoading}
              nodeLimit={-1}
            />
          )}
          {selectedUnit == 1 && (
            <GraphComponent
              trigger={trigger}
              toggleTrigger={toggleTrigger}
              resultExpanded={resultExpanded}
              toggleResult={toggleResult}
              formula={firstUnit.characterization || new Formula([])}
              terms={firstNexusTerms}
              dataLoading={nexusLoading}
              nodeLimit={-1}
            />
          )}
          {selectedUnit == 2 && (
            <GraphComponent
              trigger={trigger}
              toggleTrigger={toggleTrigger}
              resultExpanded={resultExpanded}
              toggleResult={toggleResult}
              formula={secondUnit.characterization || new Formula([])}
              terms={secondNexusTerms}
              dataLoading={nexusLoading}
              nodeLimit={-1}
            />
          )}
        </div>
      </>
    );
  }
}
