"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "./spinner";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import GraphComponent from "./graph_component";
import {
  EntitySummary,
  Formula,
  SummaryConfig,
  SummaryRequest,
  Term,
  TermType,
  Unit,
} from "../models/models";
import {
  callSearchById,
  callSummary,
  callSummaryConfig,
} from "../middleware/api";
import SummaryContent from "./summary_content";
export default function SummaryPageContainer({ id }: { id: string }) {
  const [unit, setUnit] = useState(new Unit([], null));
  const [entity, setEntity] = useState(new Term([], TermType.CONSTANT));
  const [terms, setTerms] = useState([] as Term[]);
  const [summary, setSummary] = useState(new Formula([]));
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
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
    if (localStorage.getItem("lastUnit")) {
      let stored_unit = Unit.fromJson(
        JSON.parse(localStorage.getItem("lastUnit") || "")
      );
      setUnit(stored_unit);

      let myEntitySummary = stored_unit.entities.find((es) => {
        return es.entity[0].name[0] === decodeURIComponent(id);
      });

      if (myEntitySummary) {
        let myTerms = [] as Term[];
        myTerms = [
          myEntitySummary.entity[0],
          ...myEntitySummary.summary.terms.map((t) => {
            return t.full_repr || new Term([], TermType.CONSTANT);
          }),
        ];
        setEntity(myEntitySummary.entity[0]);
        setTerms(myTerms);
        setSummary(myEntitySummary.summary.atoms);
        setLoading(false);
        setSummaryLoading(false);
      } else {
        callSearchById(decodeURIComponent(id), "").then((t) => {
          if (t instanceof Term) {
            setEntity(t);
            setLoading(false);
            let singleUnit = new Unit([new EntitySummary([t])], null);
            callSummaryConfig(singleUnit, "").then((sum) => {
              if (sum instanceof SummaryConfig) {
                sum.beautify = true;
                callSummary(
                  new SummaryRequest(singleUnit, sum as SummaryConfig),
                  ""
                ).then((u) => {
                  if (u instanceof Unit) {
                    let myTerms = [] as Term[];
                    let myEntitySummary = u.entities[0];
                    myTerms = [
                      myEntitySummary.entity[0],
                      ...myEntitySummary.summary.terms.map((t) => {
                        return t.full_repr || new Term([], TermType.CONSTANT);
                      }),
                    ];
                    setTerms(myTerms);
                    setSummary(myEntitySummary.summary.atoms);
                    setSummaryLoading(false);
                  }
                });
              }
            });
          } else {
            router.push("/dashboard");
          }
        });
      }
    } else {
      callSearchById(decodeURIComponent(id), "").then((t) => {
        if (t instanceof Term) {
          setEntity(t);
          setLoading(false);
          let singleUnit = new Unit([new EntitySummary([t])], null);
          callSummaryConfig(singleUnit, "").then((sum) => {
            if (sum instanceof SummaryConfig) {
              sum.beautify = true;
              callSummary(
                new SummaryRequest(singleUnit, sum as SummaryConfig),
                ""
              ).then((u) => {
                if (u instanceof Unit) {
                  let myTerms = [] as Term[];
                  let myEntitySummary = u.entities[0];
                  myTerms = [
                    myEntitySummary.entity[0],
                    ...myEntitySummary.summary.terms.map((t) => {
                      return t.full_repr || new Term([], TermType.CONSTANT);
                    }),
                  ];
                  setTerms(myTerms);
                  setSummary(myEntitySummary.summary.atoms);
                  setSummaryLoading(false);
                }
              });
            }
          });
        } else {
          router.push("/dashboard");
        }
      });
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
              selected={decodeURIComponent(id)}
            />

            <div
              className={
                "transition-all flex flex-col md:w-10/12 grow pb-6 pt-28 md:pt-6 pl-8 md:pl-[6.5rem] pr-8 overflow-y-scroll overflow-x-hidden" +
                (sidebarExpanded ? " hidden" : " w-full")
              }
            >
              <SummaryContent entity={entity} />
            </div>
          </div>
          {!loading && (
            <GraphComponent
              trigger={trigger}
              toggleTrigger={toggleTrigger}
              resultExpanded={resultExpanded}
              toggleResult={toggleResult}
              formula={summary}
              terms={terms}
              dataLoading={summaryLoading}
              nodeLimit={10}
            />
          )}
        </div>
      </>
    );
  }
}
