"use client";

import { useEffect, useState } from "react";
import Search from "./search";
import SecondaryButton from "./secondary_button";
import { useRouter } from "next/navigation";
import {
  EntitySummary,
  Formula,
  SummaryConfig,
  SummaryRequest,
  Term,
  TermType,
  Unit,
} from "../models/models";
import AuxButton from "./aux_button";
import MiniCard from "./mini_card";
import {
  callCharacterize,
  callSummary,
  callSummaryConfig,
} from "../middleware/api";
import Spinner from "./spinner";
import MicroCard from "./micro_card";

export default function CompareSearchComponent({
  actualUnit,
  first,
  second,
  updateFirst,
  updateFirstNexusTerms,
  updateSecond,
  updateSecondNexusTerms,
  compareCallback,
}: {
  actualUnit: Unit;
  first: Unit;
  second: Unit;
  updateFirst: (u: Unit) => void;
  updateFirstNexusTerms: (t: Term[]) => void;
  updateSecond: (u: Unit) => void;
  updateSecondNexusTerms: (t: Term[]) => void;
  compareCallback: () => void;
}) {
  const router = useRouter();
  const [firstValorized, setFirstValorized] = useState(false);
  const [secondValorized, setSecondValorized] = useState(false);
  const [waitingFirst, setWaitingFirst] = useState(false);
  const [waitingSecond, setWaitingSecond] = useState(false);

  useEffect(() => {
    if (actualUnit) {
      updateFirst(Unit.byCopy(actualUnit));
      updateSecond(Unit.byCopy(actualUnit));
    }
  }, []);

  const addEntity = (ent: Term) => {
    let first: boolean = false;
    if (firstValorized && secondValorized) {
      throw new Error("Both units are valorized");
    }
    if (!firstValorized) {
      setWaitingFirst(true);
      setFirstValorized(true);
      first = true;
    } else if (!secondValorized) {
      setWaitingSecond(true);
      setSecondValorized(true);
      first = false;
    }
    let newUnit = Unit.byCopy(actualUnit);
    newUnit.characterization = null;
    newUnit.entities.push(new EntitySummary([ent as Term] as Term[]));
    callSummaryConfig(newUnit, "").then((sum) => {
      if (sum instanceof SummaryConfig) {
        sum.beautify = true;
        callSummary(new SummaryRequest(newUnit, sum as SummaryConfig), "").then(
          (u) => {
            if (u instanceof Unit) {
              callCharacterize(u, "").then((uFull) => {
                if (uFull instanceof Unit) {
                  let newUnit = uFull;
                  const nt = uFull.entities[0].summary.terms.map((t) => {
                    return t.full_repr || new Term([], TermType.CONSTANT);
                  });
                  if (first) {
                    updateFirstNexusTerms(nt);
                    updateFirst(newUnit);
                    setWaitingFirst(false);
                    setFirstValorized(true);
                  } else {
                    updateSecondNexusTerms(nt);
                    updateSecond(newUnit);
                    setWaitingSecond(false);
                    setSecondValorized(true);
                  }
                } else {
                  if (first) {
                    console.error("Error in response");
                    setWaitingFirst(false);
                    setFirstValorized(false);
                  } else {
                    console.error("Error in response");
                    setWaitingSecond(false);
                    setSecondValorized(false);
                  }
                }
              });
            } else {
              if (first) {
                console.error("Error in response");
                setWaitingFirst(false);
                setFirstValorized(false);
              } else {
                console.error("Error in response");
                setWaitingSecond(false);
                setSecondValorized(false);
              }
            }
          }
        );
      } else {
        if (first) {
          console.error("Error in response");
          setWaitingFirst(false);
          setFirstValorized(false);
        } else {
          console.error("Error in response");
          setWaitingSecond(false);
          setSecondValorized(false);
        }
      }
    });
  };

  const removeEntity = (first: boolean) => {
    if (first) {
      updateFirst(Unit.byCopy(actualUnit));
      setFirstValorized(false);
    } else {
      updateSecond(Unit.byCopy(actualUnit));
      setSecondValorized(false);
    }
  };

  const yourEntities = actualUnit.entities.map((r) => (
    <MicroCard entity={r.entity[0]} />
  ));

  const yourEntitiesExtended = actualUnit.entities.map((r) => (
    <MiniCard entity={r.entity[0]} />
  ));

  const firstEntities = first?.entities
    .filter((e) => {

      return !actualUnit.entities.some((a) =>
        EntitySummary.compareEntitySummary(a, e)
      );
    })
    .map((r) => <MiniCard entity={r.entity[0]} />);

  const secondEntities = second?.entities
    .filter((e) => {
      return !actualUnit.entities.some((a) =>
        EntitySummary.compareEntitySummary(a, e)
      );
    })
    .map((r) => <MiniCard entity={r.entity[0]} />);

  const initialEntities = actualUnit.entities.map((r) => (
    <MiniCard entity={r.entity[0]} />
  ));

  return (
    <>
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6 mt-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 fill-red-600 transition-all"
          >
            <path
              fillRule="evenodd"
              d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-align-bottom text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300 w-fit">
            Compare
          </span>
        </div>
        <span className="mt-2 text-xs md:text-sm font-semibold text-slate-400">
          You can choose two fresh entities and compare them each other with
          respect to the initial set
        </span>
      </div>
      <div className={"flex flex-col w-full"}>
        {
}
        {!(firstValorized && secondValorized) && (
          <Search
            placeholder={"Search to add"}
            unitSize={1}
            addEntity={addEntity}
          />
        )}
        <div className="mt-6">
          <div className="mt-8 mb-8 items-center flex gap-4 flex-wrap justify-between transition-all">
            <span className="text-lg md:text-xl font-bold text-slate-600 dark:text-slate-300">
              First Set
            </span>
            <div>
              <AuxButton
                text="Clear"
                icon="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                callback={() => removeEntity(true)}
              />
            </div>
          </div>
          <div className="transition-all flex w-full flex-wrap gap-4">
            {yourEntities}
            {!waitingFirst && firstEntities}
            {waitingFirst && (
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full justify-center items-center py-12 transition-all">
          <SecondaryButton
            text="Compare"
            disabled={
              (!firstValorized && !secondValorized) ||
              waitingFirst ||
              waitingSecond
            }
            icon="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z"
            callback={() => compareCallback()}
          />
        </div>
        <div>
          <div className="mb-8 items-center flex gap-4 flex-wrap justify-between transition-all">
            <span className="text-lg md:text-xl font-bold text-slate-600 dark:text-slate-300">
              Second Set
            </span>
            <div>
              <AuxButton
                text="Clear"
                icon="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                callback={() => removeEntity(false)}
              />
            </div>
          </div>

          <div className="transition-all flex w-full flex-wrap gap-4 transition-all">
            {yourEntities}
            {!waitingSecond && secondEntities}
            {waitingSecond && (
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-24 pb-8">
        <div className="mb-8 items-center flex gap-4 flex-wrap justify-between transition-all">
          <span className="text-lg md:text-xl font-bold text-slate-600 dark:text-slate-300">
            Initial entities
          </span>
        </div>

        <div className="transition-all flex w-full flex-wrap gap-4 transition-all">
          {yourEntitiesExtended}
        </div>
      </div>
    </>
  );
}
