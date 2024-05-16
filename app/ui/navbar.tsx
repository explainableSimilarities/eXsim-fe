"use client";

import SecondaryButton from "./secondary_button";

export default function Navbar({
  resultExpanded,
  sidebarExpanded,
  toggleResult,
  toggleSidebar,
}: {
  resultExpanded: boolean;
  sidebarExpanded: boolean;
  toggleResult: () => void;
  toggleSidebar: () => void;
}) {
  return (
    <>
      <div
        className={
          "transition-all md:hidden fixed z-10 w-full bg-blue-200 place-content-between p-2 py-4 border-b border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-600/40" +
          (sidebarExpanded || resultExpanded ? " hidden" : " flex")
        }
      >
        <div className="flex">
          <div
            onClick={toggleSidebar}
            className="transition-all flex items-center font-semibold text-slate-600 dark:text-slate-300 block bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 aria-selected:bg-slate-200 dark:aria-selected:bg-slate-700 py-3 px-3 cursor-pointer rounded-md"
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
              "transition-all self-center w-fit opacity-100 pb-2 pt-2 px-3 font-sans font-extrabold antialiased text-transparent bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400 text-2xl md:text-3xl"
            }
          >
            neXSim
          </h1>
        </div>
        <SecondaryButton
          text="See result"
          icon="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
          callback={toggleResult}
        />
      </div>
    </>
  );
}
