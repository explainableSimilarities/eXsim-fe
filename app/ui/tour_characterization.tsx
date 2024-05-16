"use client";

import Button from "./button";

export default function TourCharacterization({
  showExamples,
}: {
  showExamples: (page: number) => void;
}) {
  return (
    <>
      <div className="flex flex-col items-start justify-start w-full h-full gap-4 lg:mb-6 mb-12">
        <div className="w-fit flex justify-start items-center">
          <img
            src="/tutorial/dashboard.png"
            alt="tour_search"
            className="w-fit max-h-72 h-auto mt-1 mb-1 ml-1 mr-1 border border-slate-600 rounded-md shadow-md "
          />
        </div>
        <div className="w-full text-base font-semibold text-justify">
          Once obtained a characterization, in the dashboard you can find a
          brief explanation of the similarity for the entities you have chosen.
          You can visualize it in form of a graph or a text switching the mode
          with the buttons on the right side of the page. In the left side of
          the page you can find the list of the entities you have chosen, for
          which you can visualize the summary, and some available operations,
          including the possibility of looking for similar entities. See the other sections for more details or run some
          example.
        </div>
      </div>
      <div className="flex flex-col flex-row items-start justify-start w-full h-full gap-4 mt-3">
        <Button
          text="Try Examples for Dashboard"
          icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
          callback={() => showExamples(1)}
        />
      </div>
    </>
  );
}
