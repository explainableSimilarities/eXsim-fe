"use client";

import Button from "./button";

export default function TourSummary({
  showExamples,
}: {
  showExamples: (page: number) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-start justify-start w-full h-full gap-4 lg:mb-6 mb-12">
        <div className="flex justify-start items-center w-fit">
          <img
            src="/tutorial/Summary.png"
            alt="tour_search"
            className="w-fit max-h-72 mt-1 mb-1 ml-1 mr-1  border border-slate-600 rounded-md shadow-md "
          />
        </div>
        <div className="w-full text-base font-semibold text-justify">
          In the summary page you can find a brief explanation of the properties
          of one of the entities you have chosen. In particular, on the right it
          is shown a relevant and meaningful portion of the Knowledge Graph
          involving the selected entity, either in the form of a graph or a
          text. On the left side of the page you can find a brief description of
          the entity and its synonyms, directly coming from Babelnet. Check the
          other sections for more details or run some example. <br />
        </div>
      </div>
      <div className="flex flex-col flex-row items-start justify-start w-full h-full gap-4 mt-3">
        <Button
          text="Try Examples for Summary"
          icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
          callback={() => showExamples(2)}
        />
      </div>
    </>
  );
}
