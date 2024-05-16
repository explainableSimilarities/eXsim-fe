"use client";

import { Term } from "../models/models";
import AuxButton from "./aux_button";

import { useRouter } from "next/navigation";
import EntityCard from "./entity_card";
import Spinner from "./spinner";
import SecondaryButton from "./secondary_button";

export default function EntityListComponent({
  caller,
  initialEntities,
  similarEntities,
  isDefault,
  loadingExpansion,
  lastPage,
  lastCalled,
  allFetched,
  update,
}: {
  caller: string;
  title: string;
  initialEntities: Term[];
  similarEntities: Term[];
  isDefault: boolean;
  loadingExpansion: boolean;
  lastPage: number;
  lastCalled: number;
  allFetched: boolean;
  update: () => void;
}) {
  const router = useRouter();
  const backToCaller = () => {
    router.push(caller);
  };
  return (
    <div className={"w-full h-full relative flex-column overflow-y-scroll"}>
      <div className="title">
        <div className="mt-4 mb-4 items-center flex flex-wrap justify-between">
          <span className="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300">
            Your Entities
          </span>
        </div>
      </div>
      <div className="transition-all flex w-full flex-wrap gap-4">
        {initialEntities.map((entity, index) => {
          return (
            <EntityCard
              entity={entity}
              showButton={true}
              buttonInfo={{
                icon: "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
                text: "See summary",
              }}
              callback={() => {
                router.push("/" + entity.name[0]);
              }}
            />
          );
        })}
      </div>
      <div className="title">
        <div className="mt-8 mb-4 items-center flex flex-wrap justify-between">
          {isDefault && (<span className="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300">
            100% Similar Entities
          </span>)}
          {!isDefault && (<span className="text-xl md:text-2xl font-bold text-slate-600 dark:text-slate-300">
            Similar Entities
          </span>)}
        </div>
      </div>
      <div className="transition-all flex w-full flex-wrap gap-4">
        {!loadingExpansion &&
          similarEntities.length > 0 &&
          similarEntities.map((entity, index) => {
            return (
              <EntityCard
                entity={entity}
                showButton={true}
                buttonInfo={{
                  icon: "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z",
                  text: "See summary",
                }}
                callback={() => {
                  router.push("/" + entity.name[0]);
                }}
              />
            );
          })}
        {isDefault && !loadingExpansion && similarEntities.length === 0 && (
          <span>
            There are no more entities sharing all the properties with the ones
            you have selected. Please relax some properties to include more
            results
          </span>
        )}
        {!isDefault && !loadingExpansion && similarEntities.length === 0 && (
          <span>
            There are no entities sharing all the properties with the ones
            you have selected. Please relax some properties to include more
            results
          </span>
        )}
        {loadingExpansion && <Spinner />}
      </div>
      
      <div className="flex w-full flex-wrap gap-2 ">
        <div className="flex w-full justify-center">
          {!loadingExpansion && !allFetched && lastPage === lastCalled && (
            <Spinner />
          )}
          {!loadingExpansion && !allFetched && lastPage !== lastCalled && (
            <div className="mt-12">
              {" "}
              <SecondaryButton
                text="See more"
                icon="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                callback={update}
              />{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
