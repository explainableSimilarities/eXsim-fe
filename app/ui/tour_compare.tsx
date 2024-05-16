"use client";

import Button from "./button";

export default function TourCompare( {showExamples} : {showExamples: (page: number) => void}) {


  return (
    <>
    <div className="flex flex-col lg:flex-row items-start justify-start w-full h-full gap-4 lg:mb-12">
        <div className="flex justify-start items-start w-2/3">
          <img src="/tutorial/Compare_units.png" alt="tour_search" className="w-full md:w-fit w-lg max-h-72 h-auto mt-1 mb-1 ml-1 mr-1 border border-slate-600 rounded-md shadow-md"/>
        </div>
        <div className="w-full mb-3 lg:mb-0 text-base font-semibold text-justify justify-start">
        On the basis of the initial set of entities, there is the possibility to compare other entities from the Knowledge Base with respect to each other. 
          The comparison is also based on characterization, providing information on their common properties and differences, obtaining in output a Similarity Relation. 
          Once chosen the entities to compare via the search bar, the button "Compare" will show you the result.
        </div>
    </div>
      <div className="flex flex-col lg:flex-row items-start justify-start w-full h-full gap-4 mt-3">
        <div className="flex justify-start items-start lg:h-48 w-2/3">
          <img src="/tutorial/Compare_result.png" alt="tour_search_res" className="w-full md:w-fit max-h-72 h-auto mt-1 mb-1 ml-1 mr-1  border border-slate-600 rounded-md shadow-md"/>
        </div>
        <div className="w-full flex flex-col justify-start items-start mb-12 lg:mb-0 text-base font-semibold text-ellipsis text-justify">
        The Similarity relation in output shows out whether the two sets are "SIMILAR", or if one is "MORE GENERIC THAN" the other, or if they are "INCOMPARABLE". 
        You can also visualize the differences in terms of characterizations of the two sets, through the button "See why".
          See the other sections for more details or run some example.
        </div>
      </div>
      <div className="flex flex-col flex-row items-start justify-start w-full h-full gap-4 mt-3 ">
        <Button text="Try examples for Compare" icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" callback={() => showExamples(4)}/>
       </div>
      
    </>
  );
}