"use client";
import { useEffect, useState } from "react";
import Search from "./search";
import BottomDrawer from "./bottom_drawer";
import EntityCard from "./entity_card";
import SecondaryButton from "./secondary_button";
import Spinner from "./spinner";
import { useRouter } from "next/navigation";
import { EntitySummary, Term, Unit } from "../models/models";
import Button from "./button";

export default function SearchPageContainer() {
  const [unit, setUnit] = useState(new Unit([], null));
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const addEntity = (ent: Term) => {
    if (!unit.entities.some((e) => e.entity[0].name[0] == ent.name[0])) {
      let newUnit = new Unit(
        [...unit.entities, new EntitySummary([ent])],
        null
      );
      localStorage.setItem("currentUnit", JSON.stringify(newUnit));
      setUnit(newUnit);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("currentUnit")) {
      let stored_unit = Unit.fromJson(
        JSON.parse(localStorage.getItem("currentUnit") || "")
      );
      setUnit(stored_unit);
    }
    setLoading(false);
  }, []);

  const clearUnit = () => {
    localStorage.removeItem("currentUnit");
    setUnit(new Unit([], null));
  };

  const removeEntity = (ent: Term) => {
    if (
      unit.entities
        .map((e) => {
          return e.entity[0];
        })
        .includes(ent)
    ) {
      let newUnit = new Unit(
        unit.entities.filter((e) => e.entity[0] !== ent),
        null
      );
      localStorage.setItem("currentUnit", JSON.stringify(newUnit));
      setUnit(newUnit);
    }
  };

  const proceed = () => {
    if (unit.entities.length > 0) {
      localStorage.setItem("currentUnit", JSON.stringify(new Unit([], null)));
      localStorage.setItem("lastUnit", JSON.stringify(unit));
      router.push("/dashboard");
    }
  };

  const unitEntities = unit.entities.map((r) => (
    <EntityCard
      entity={r.entity[0]}
      showButton={true}
      buttonInfo={{
        icon: "M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z",
        text: "Remove",
      }}
      callback={removeEntity}
    />
  ));

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
        <div
          className={
            "flex flex-col w-full " +
            (unit.entities.length == 0
              ? "items-center p-12 md:py-32 lg:p-32"
              : "p-12")
          }
        >
          <div
            className={
              "flex items-center w-full flex-wrap " +
              (unit.entities.length == 0 ? "flex-col" : "gap-8 sm:gap-12")
            }
          >
            <h1
              className={
                "transition-all font-sans font-extrabold antialiased text-transparent bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400 " +
                (unit.entities.length == 0
                  ? "text-5xl md:text-6xl"
                  : "text-3xl md:text-4xl")
              }
            >
              neXSim
            </h1>
            <Search
              placeholder={
                unit && unit.entities.length == 0
                  ? "Start searching"
                  : "Search to add"
              }
              unitSize={unit.entities.length}
              addEntity={addEntity}
            />
          </div>
          {
}
          {unit.entities.length > 1 && (
            <div className="mt-12 mb-8 items-center flex gap-4 flex-wrap justify-between">
              <span className="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300">
                Entities to analyze
              </span>
              <div className="flex gap-4">
                <SecondaryButton
                  text="Restart"
                  icon="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                  callback={clearUnit}
                />
                <Button
                  text="Proceed"
                  icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
                  callback={proceed}
                />
              </div>
            </div>
          )}
          {unit.entities.length == 1 && (
            <div className="mt-12 mb-8 items-center flex gap-4 flex-wrap justify-between">
              <span className="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300">
                Entities to analyze
              </span>
              <div className="flex gap-4">
                <SecondaryButton
                  text="Restart"
                  icon="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                  callback={clearUnit}
                />
              </div>
            </div>
          )}
          <div className="transition-all flex w-full flex-wrap gap-4">
            {unitEntities}
          </div>
        </div>
        {
}
      </>
    );
  }
}
