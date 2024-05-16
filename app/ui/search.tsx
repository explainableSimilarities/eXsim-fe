"use client";

import { useState, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Term } from "../models/models";
import { callSearchByLemma } from "../middleware/api";

export default function Search({
  placeholder,
  unitSize,
  addEntity,
}: {
  placeholder: string;
  unitSize: number;
  addEntity: (ent: Term) => void;
}) {
  const [result, setResult] = useState([] as Term[]);
  const [lastTerm, setLastTerm] = useState("");
  const [page, setPage] = useState(0);
  const [noMore, setNoMore] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  let lastTermTmp = "";
  let loading = false;
  function normalizeString(mainSense: string) {
    mainSense = mainSense.replaceAll("_", " ");
    return mainSense.charAt(0).toUpperCase() + mainSense.slice(1);
  }

  function extractSynonyms(synonyms: string[]) {
    if (synonyms) {
      if (synonyms.length >= 2) synonyms = synonyms.slice(0, 2);

      return synonyms.map((s) => normalizeString(s)).join(", ");
    }
    return synonyms;
  }

  async function update() {
    let actualTerm = lastTerm;
    if (actualTerm) {
      loading = true;

      callSearchByLemma(actualTerm, page, "").then((data) => {
        if (data instanceof Array) {
          const newData = data as Term[];
          if (lastTerm == actualTerm && loading)
            setResult(result.concat(newData));
          setPage(page + 1);
          if (newData.length < 10) setNoMore(true);
          loading = false;
        }
      });
    }
  }

  function resetSearch() {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
    setResult([]);
    setLastTerm("");
    setPage(0);
    setNoMore(false);
    loading = false;
    if(searchInputRef.current)
      searchInputRef.current.value = "";
  }

  const handleSearch = useDebouncedCallback(async (term: string) => {
    term = term.trim();
    lastTermTmp = term;
    loading = true;

    if (term) {
      callSearchByLemma(term, 0, "").then((data) => {
        if (data instanceof Array) {
          const newData = data as Term[];
          if (term === lastTermTmp) {
            setResult(newData);
            setLastTerm(term);
            setPage(1);
            setNoMore(newData.length < 10);
            if (scrollContainerRef.current)
              scrollContainerRef.current.scrollTop = 0;
            loading = false;
          }
        }
      });
    } else {
      resetSearch();
    }
  }, 200);

  const searchResults = result.map((r) => (
    <div
      key={r.name[0]}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        resetSearch();
        addEntity(r);
      }}
      className="transition-all flex items-center gap-5 font-semibold text-slate-600 dark:text-slate-300 block max-w-xl w-full bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 py-4 px-5 cursor-pointer"
    >
      <div
        className="min-w-10 min-h-10 bg-cover rounded-md"
        style={{
          backgroundImage:
            `url("` + (r.babelNetEntity && r.babelNetEntity.image_url) + `"), url("/default.svg")`,
        }}
      ></div>
      <div className="flex flex-col gap-1 overflow-hidden">
        <div className="flex gap-4 items-center">
          <span className="text-align-bottom text-transparent text-lg md:text-xl font-bold bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400">
            {normalizeString((r.babelNetEntity && r.babelNetEntity.main_sense) || "")}
          </span>
          <span className="text-sm font-semibold text-slate-400 overflow-hidden text-nowrap text-ellipsis">
            {extractSynonyms((r.babelNetEntity && r.babelNetEntity.synonyms) || [])}
          </span>
        </div>
        <span className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
          {(r.babelNetEntity && r.babelNetEntity.description)}
        </span>
      </div>
    </div>
  ));

  return (
    <div
      className={
        "relative flex flex-col " +
        (unitSize == 0 ? "w-full items-center" : "grow")
      }
    >
      <form
        className={
          "relative flex flex-col " +
          (unitSize == 0 ? "w-full items-center" : "grow")
        }
        onSubmit={(e) => {
          e.preventDefault();
          if (result && result.length > 0) {
            resetSearch();
            addEntity(result[0]);
          }
        }}
      >
        <label
          className={
            "relative block md:min-w-96 max-w-xl w-full " +
            (unitSize == 0 ? "mt-14" : "")
          }
        >
          <span className="sr-only">Search</span>
          <input
            autoComplete="off"
            ref={searchInputRef}
            className="transition-all text-sm md:text-base font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 placeholder:font-semibold placeholder:text-slate-400 placeholder:dark:text-slate-500 block w-full border border-slate-300 dark:border-slate-600 rounded-lg py-3 pl-5 pr-14 shadow-sm hover:shadow-md dark:shadow-slate-600/40 dark:hover:shadow-slate-600/40 focus:outline-none focus:border-unical-red-600 focus:ring-unical-red-600 focus:ring-1"
            placeholder={placeholder}
            type="text"
            name="search"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            onBlur={() => {
              setShowResults(false);
            }}
            onFocus={() => {
              setShowResults(true);
            }}
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 stroke-3 fill-red-600 stroke-red-600"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </label>
      </form>

      <div
        ref={scrollContainerRef}
        onScroll={(e) => {
          if (
            (e.target as HTMLDivElement).scrollHeight - (e.target as HTMLDivElement).scrollTop <= 400 &&
            !loading &&
            !noMore
          )
            update();
        }}
        className={
          "absolute overflow-auto flex flex-col max-w-xl w-full h-56 z-10 border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-600 rounded-lg shadow-sm" +
          (result && result.length > 0 && showResults ? " show" : " hidden") +
          (unitSize == 0 ? " mt-28" : " mt-14")
        }
      >
        {searchResults}
      </div>
    </div>
  );
}
