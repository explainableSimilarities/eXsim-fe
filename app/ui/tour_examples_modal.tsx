"use client";

import { useRouter } from "next/navigation";
import { Unit } from "../models/models";
import AuxButton from "./aux_button";
import ClickableMiniCard from "./clickable_mini_card";
import MiniCard from "./mini_card";

export default function TourExamplesModal({
  page,
  setShowModal,
  examples,
  showModalLoading,
}: {
  page: number;
  setShowModal: () => void;
  examples: Unit[];
  showModalLoading: () => void;
}) {
  const pageDescription = [
    "Search",
    "Dashboard",
    "Summary",
    "Similar Entities",

  ];

  const pageLanding = ["/", "/dashboard", "/", "/expansion", 
];

  const router = useRouter();
  let results: JSX.Element[] = [];

  const manageRoute = (index: number) => {
    return () => {
      localStorage.setItem("lastUnit", JSON.stringify(examples[index]));
      router.push(`${pageLanding[page]}`);

      setShowModal();
      showModalLoading();
    };
  };

  const manageSummary = (uIndex: number, eIndex: number) => {
    router.push(`/${examples[uIndex].entities[eIndex].entity[0].name[0]}`);
  };

  if (page != 2) {
    results = examples.map((result, index) => {
      const entities = result.entities.map((e) => {
        return <MiniCard entity={e.entity[0]} />;
      });
      return (
        <div
          className="flex flex-col w-full h-fit margin-8 gap-4 items-center justify-start justify-between bg-slate-100/30 border-md rounded-lg border-slate-300 shadow-lg pr-12 mb-12 hover:bg-unical-red-300/30 hover:cursor-pointer overflow-y-hidden"
          onClick={manageRoute(index)}
        >
          <span className="pl-8 mt-4 text-xl font-semibold">
            {" "}
            Run Example {index + 1} ({pageDescription[page]})
          </span>
          <div className="flex w-full flex-wrap pl-12 flex-col md:flex-row gap-4 w-fit mb-12">
            {entities}
          </div>
        </div>
      );
    });
  } else {
    results = examples.map((result, index) => {
      const entities = result.entities.map((e, i2) => {
        return (
          <ClickableMiniCard
            entity={e.entity[0]}
            clickCallback={() => {
              manageSummary(index, i2);
            }}
          />
        );
      });
      return <>{entities}</>;
    });
  }

  return (
    <>
      <div className="z-[450] fixed w-full bg-slate-100/[0.5] h-full top-0 left-0 blur-lg backdrop-opacity-90"></div>
      <div className="z-[500] fixed top-[10%] left-[10%] w-[80%] h-[80%] border-md rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-600/40">
        <div className="flex flex-col w-full h-full gap-4 p-8">
          <span className="text-2xl font-bold">
            {" "}
            Try {pageDescription[page]}{" "}
          </span>
          <div className="flex flex-row flex-wrap overflow-x-scroll h-fit mt-12 mb-12 gap-4">
            {results}
          </div>
          <div className="fixed top-[12%] left-[75%] lg:left-[83%] w-full justify-center">
            <AuxButton
              text="Exit"
              icon={
                "M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
              }
              callback={setShowModal}
            />
          </div>
        </div>
      </div>
    </>
  );
}
