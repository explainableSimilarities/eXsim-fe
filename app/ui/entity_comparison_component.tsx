"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Unit, UnitRelation, UnitRelationType } from "../models/models";
import AuxButton from "./aux_button";
import Spinner from "./spinner";
import MiniCard from "./mini_card";
import ComparisonModal from "./comparison_modal";
import { init } from "next/dist/compiled/webpack/webpack";

export default function EntityComparisonComponent({
  actualUnit,
  first,
  second,
  selectedUnit,
  setSelectedUnit,
  relation,
}: {
  actualUnit: Unit;
  first: Unit;
  second: Unit;
  selectedUnit: number;
  setSelectedUnit: (u: number) => void;
  relation: UnitRelationType;
}) {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const actualEntities = actualUnit.entities.map((r) => (
    <MiniCard entity={r.entity[0]} />
  ));

  const unit1Entities = first.entities.map((r) => (
    <MiniCard entity={r.entity[0]} />
  ));

  const unit2Entities = second.entities.map((r) => (
    <MiniCard entity={r.entity[0]} />
  ));

  return (
    <>
      {showModal && (
        <ComparisonModal
          unit1={first}
          unit2={second}
          simRelation={relation}
          closeMe={() => setShowModal(!showModal)}
        />
      )}

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
      <div className={"flex flex-col w-full"}>
        {
}

        <span className="mt-4 text-lg md:text-xl font-semibold text-slate-600 dark:text-slate-300">
          {relation == UnitRelationType.INC &&
            "The two sets of entities are incomparable"}
          {relation == UnitRelationType.PREC &&
            "The first set of entities is more specific than the second"}
          {relation == UnitRelationType.SIM &&
            "The first set set of entities is similar to the second"}
          {relation == UnitRelationType.SUCC &&
            "The first set of entities is more generic than the second"}
        </span>

        <span className="mt-2 text-sm md:text-base font-semibold text-slate-400">
          {relation == UnitRelationType.INC &&
            "The two formulas are different. Click the button below to see more details."}
          {relation == UnitRelationType.PREC &&
            "Comparing the two formulas, you can see that the first one is more specific. Click the button below to see more details."}
          {relation == UnitRelationType.SIM &&
            "Both sets are characterized by the same formula. Click the button below to see more details."}
          {relation == UnitRelationType.SUCC &&
            "Comparing the two formulas, you can see that the second one is more specific. Click the button below to see more details."}
        </span>

        <span className="mt-6">
          <AuxButton
            icon="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
            text="See why"
            callback={() => {
              setShowModal(true);
            }}
          />
        </span>

        <div className="mt-10 mb-6 items-center flex gap-4 flex-wrap justify-between">
          <span className="text-lg md:text-xl font-bold text-slate-600 dark:text-slate-300">
            First Set
          </span>
          {selectedUnit != 1 && (
            <AuxButton
              icon="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              text="Show in graph"
              callback={() => {
                setSelectedUnit(1);
              }}
            />
          )}
          {selectedUnit == 1 && (
            <span className="text-sm md:text-base text-slate-400">
              Selected
            </span>
          )}
        </div>

        <div className="transition-all flex w-full flex-wrap gap-4">
          {unit1Entities}
        </div>

        <div className=" mt-8 mb-6 items-center flex gap-4 flex-wrap justify-between">
          <span className="text-lg md:text-xl font-bold text-slate-600 dark:text-slate-300">
            Second Set
          </span>
          {selectedUnit != 2 && (
            <AuxButton
              icon="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              text="Show in graph"
              callback={() => {
                setSelectedUnit(2);
              }}
            />
          )}
          {selectedUnit == 2 && (
            <span className="text-sm md:text-base text-slate-400">
              Selected
            </span>
          )}
        </div>

        <div className="transition-all flex w-full flex-wrap gap-4">
          {unit2Entities}
        </div>

        <div className=" mt-8 mb-6 items-center flex gap-4 flex-wrap justify-between">
          <span className="text-lg md:text-xl font-bold text-slate-600 dark:text-slate-300">
            Initial Entities
          </span>
          {selectedUnit != 0 && (
            <AuxButton
              icon="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              text="Show in graph"
              callback={() => {
                setSelectedUnit(0);
              }}
            />
          )}
          {selectedUnit == 0 && (
            <span className="text-sm md:text-base text-slate-400">
              Selected
            </span>
          )}
        </div>

        <div className="transition-all flex w-full flex-wrap gap-4 pb-8">
          {actualEntities}
        </div>
      </div>
    </>
  );
}
