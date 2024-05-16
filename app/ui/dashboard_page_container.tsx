"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import GraphComponent from "./graph_component";
import {
  BabelnetEntity,
  EntitySummary,
  Formula,
  Predicate,
  PredicateType,
  Summary,
  SummaryConfig,
  SummaryRequest,
  Term,
  TermType,
  Unit,
} from "../models/models";
import {
  callCharacterize,
  callSearchByIdBatched,
  callSummary,
  callSummaryConfig,
} from "../middleware/api";
import DashboardContent from "./dashboard_content";
export default function DashboardPageContainer() {
  const [unit, setUnit] = useState(new Unit([], null));
  const [nexusTerms, setNexusTerms] = useState([] as Term[]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [nexusLoading, setNexusLoading] = useState(true);
  const [resultExpanded, setResultExpanded] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [trigger, setTrigger] = useState(true);

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
              selected={"dashboard"}
            />

            <div
              className={
                "transition-all flex flex-col md:w-10/12 grow pb-6 pt-28 md:pt-6 pl-8 md:pl-[6.5rem] pr-8 overflow-y-scroll overflow-x-hidden" +
                (sidebarExpanded ? " hidden" : " w-full")
              }
            >
              <DashboardContent unit={unit} />
            </div>
          </div>
          {!loading && (
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
        </div>
      </>
    );
  }
}
