"use client";

import { useRouter } from "next/navigation";
import Button from "./button";

export default function TourSearchPage({
  showExamples,
}: {
  showExamples: (page: number) => void;
}) {

  const router = useRouter();

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start justify-start w-full h-full gap-4 lg:mb-6">
        <div className="w-fit flex justify-start items-start ">
          <img
            src="/tutorial/Search.png"
            alt="tour_search"
            className="w-full md:w-fit md:max-w-lg max-h-72 h-auto mt-1 mb-1 ml-1 mr-1 border border-slate-600 rounded-md shadow-md"
          />
        </div>
        <div className="w-full mb-3 lg:mb-0 text-base font-semibold text-justify justify-start">
          You can start using neXSim searching entities by their names.
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-start w-full h-full gap-4 mt-3">
        <div className="flex justify-start items-start lg:min-h-48 w-fit">
          <img
            src="/tutorial/Search_result.png"
            alt="tour_search_res"
            className="w-full md:w-fit max-h-72 md:max-w-lg h-auto mt-1 mb-1 ml-1 mr-1 border border-slate-600 rounded-md shadow-md"
          />
        </div>
        <div className="w-full flex flex-col justify-start items-start mb-12 lg:mb-0 text-base font-semibold text-ellipsis text-justify">
          Add two or more entities to discover their similarities. By clicking
          on "Proceed" when you are done, you will land on the dashboard page,
          and you will be able to see the characterization of the entities you
          have chosen, explaining their similarity. For more details, continue
          visiting the next sections of the guide, or run some example to see
          how it works.
        </div>
      </div>

      <div className="flex flex-col flex-row items-start justify-start w-full h-full gap-4 mt-3">
        <Button
          text="Try Search"
          icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
          callback={() => router.push("/")}
        />
      </div>
    </>
  );
}
