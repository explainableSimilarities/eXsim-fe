"use client";

import Button from "./button";

export default function TourExpand({
  showExamples,
}: {
  showExamples: (page: number) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-start justify-start w-full h-full gap-4 lg:mb-6 mb-12">
        <div className="flex justify-start items-center w-fit">
          <img
            src="/tutorial/Check_similar.png"
            alt="tour_search"
            className="w-fit max-h-72 mt-1 mb-1 ml-1 mr-1  border border-slate-600 rounded-md shadow-md "
          />
        </div>
        <div className="w-full text-base font-semibold text-justify">
        Characterizations are also a tool which can be used to find similar
          entities within the Knowledge Base. In fact, via the button "Similar
          Entities" in the dashboard, one can obtain a list of entities sharing
          all the properties expressed with the characterization. The "100%
          similar" entities are the ones sharing all the properties. Users can
          also "relax" some properties of the characterization for including
          more entities in the list. See the other sections for more details or
          run some example. <br />
        </div>
      </div>
      <div className="flex flex-col flex-row items-start justify-start w-full h-full gap-4 mt-3">
        <Button
          text="Try examples for Similar Entities"
          icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
          callback={() => showExamples(3)}
        />
      </div>
    </>
  );
}
