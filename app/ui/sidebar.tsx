"use client";

import { useRouter } from "next/navigation";
import { EntitySummary } from "../models/models";

export default function Sidebar({
  sidebarExpanded,
  toggleSidebar,
  unitEntities,
  selected
}: {
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  unitEntities: EntitySummary[];
  selected:string;
}) {
  const router = useRouter();
  
  function normalizeString(mainSense: string) {
    mainSense = mainSense.replaceAll("_", " ");
    return mainSense.charAt(0).toUpperCase() + mainSense.slice(1);
  }

  const unitElements = unitEntities.map((r) => (
    <div
      onClick={() => {router.push("/" + r.entity[0].name[0])}}
      key={r.entity[0].name[0]}
      aria-selected={r.entity[0].name[0] === selected}
      className="transition-all flex items-center gap-4 md:gap-0 md:group-hover:gap-4 font-semibold text-slate-600 dark:text-slate-300 block bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 aria-selected:bg-slate-200 dark:aria-selected:bg-slate-700 py-3 px-3 cursor-pointer rounded-md"
    >
      <div
        className="min-w-8 min-h-8 max-w-8 max-h-8 bg-cover border border-slate-300 dark:border-slate-600 rounded-md"
        style={{
          backgroundImage:
            `url("` + (r.entity[0].babelNetEntity && r.entity[0].babelNetEntity.image_url) + `"), url("/default.svg")`,
        }}
      ></div>
      <span className="overflow-hidden text-nowrap md:w-0 md:group-hover:w-full text-align-bottom text-base font-semibold text-slate-600 dark:text-slate-300">
        {normalizeString((r.entity[0].babelNetEntity && r.entity[0].babelNetEntity.main_sense) || "")}
      </span>
    </div>
  ));

  return (
    <>
      <div
        className={
          "transition-all p-2 py-4 pb-6 absolute h-screen place-content-between group flex-col md:w-[4.5rem] md:hover:w-6/12 border-r border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-600/40 z-10" +
          (sidebarExpanded ? " w-full flex " : " hidden md:flex ")
        }
      >
        <div
          className={
            "transition-all flex flex-col w-full gap-1 overflow-x-hidden"
          }
        >
          <h1
            className={
              "transition-all w-fit hidden md:block md:opacity-0 md:group-hover:opacity-100 pb-5 pt-2 px-3 font-sans font-extrabold antialiased text-transparent bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400 text-2xl md:text-3xl"
            }
          >
            neXSim
          </h1>
          <div className="flex items-center relative md:hidden pb-3">
            <div
              onClick={toggleSidebar}
              className="transition-all z-[7] flex items-center font-semibold text-slate-600 dark:text-slate-300 block bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 aria-selected:bg-slate-200 dark:aria-selected:bg-slate-700 py-3 px-3 cursor-pointer rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="min-w-8 min-h-8 fill-slate-500 dark:fill-slate-400 transition-all"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1
              className={
                "transition-all self-center w-full absolute text-center pb-2 pt-2 px-3 font-sans font-extrabold antialiased text-transparent bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400 text-2xl md:text-3xl"
              }
            >
              neXSim
            </h1>
          </div>
          {unitElements.length > 0 && <div
            onClick={() => {router.push("/dashboard")}}
            aria-selected={selected === "dashboard"}
            className="transition-all flex items-center gap-4 md:gap-0 md:group-hover:gap-4 font-semibold text-slate-600 dark:text-slate-300 block bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 aria-selected:bg-slate-200 dark:aria-selected:bg-slate-700 py-3 px-3 cursor-pointer rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 md:min-w-8 md:min-h-8 fill-red-600 transition-all"
            >
              <path
                fillRule="evenodd"
                d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="overflow-hidden text-nowrap md:w-0 md:group-hover:w-full text-align-bottom text-base font-semibold text-slate-600 dark:text-slate-300">
              Overview
            </span>
          </div>}
          {unitElements.length > 0 && <div className="transition-all flex items-center gap-4 md:opacity-0 md:group-hover:opacity-100 overflow-hidden font-semibold text-slate-600 dark:text-slate-300 block bg-white dark:bg-slate-800 mt-6 pb-2 px-3">
            <span className="overflow-hidden text-nowrap text-align-bottom text-base font-bold text-slate-500 dark:text-slate-400">
              Your entities
            </span>
          </div>}
          {unitElements.length > 0 && <div
            className={
              "transition-all h-[40vh] flex flex-col w-full gap-1 overflow-y-scroll md:overflow-y-hidden md:group-hover:overflow-y-scroll"
            }
          >
            {unitElements}
          </div>}
        </div>
        <div
          onClick={() => {
            router.push("/");
          }}
          aria-selected={false}
          className="transition-all flex items-center gap-4 md:gap-0 md:group-hover:gap-4 font-semibold text-slate-600 dark:text-slate-300 block bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 aria-selected:bg-slate-200 dark:aria-selected:bg-slate-700 py-3 px-3 cursor-pointer rounded-md mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 md:min-w-8 md:min-h-8 fill-red-600 transition-all"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="overflow-hidden text-nowrap md:w-0 md:group-hover:w-full text-align-bottom text-base font-semibold text-slate-600 dark:text-slate-300">
            New search
          </span>
        </div>
      </div>
    </>
  );
}
