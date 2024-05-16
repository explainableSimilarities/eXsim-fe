"use client";

import AuxButton from "./aux_button";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TourSearchPage from "./tour_search";
import TourCharacterization from "./tour_characterization";
import Button from "./button";
import TourSummary from "./tour_summary";
import TourExpand from "./tour_expand";
import TourCompare from "./tour_compare";
import TourExamplesModal from "./tour_examples_modal";
import { Unit } from "../models/models";

import exOne from "../mock/example_1.json";
import exTwo from "../mock/example_2.json";
import exThree from "../mock/example_3.json";
import exFour from "../mock/example_4.json";
import exFive from "../mock/example_5.json";
import exSix from "../mock/example_6.json";
import exSeven from "../mock/example_7.json";


import Spinner from "./spinner";

export default function TourPage() {
  
  const [tourPage, setTourPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalLoading, setShowModalLoading] = useState(false);

  const router = useRouter();

  const tourPages = [
    "Search Your Entities",
    "Dashboard",
    "Summary",
    "Similar Entities",

  ];

  const examples: Unit[] = [];

  examples.push(Unit.fromJson(exOne));
  examples.push(Unit.fromJson(exTwo));
  examples.push(Unit.fromJson(exThree));
  examples.push(Unit.fromJson(exFour));
  examples.push(Unit.fromJson(exFive));
  examples.push(Unit.fromJson(exSix));
  examples.push(Unit.fromJson(exSeven));

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleModalLoading = () => {
    setShowModalLoading(!showModalLoading);
  };

  useEffect(() => {
    if (localStorage.getItem("lastMenuPage")) {
      setTourPage(parseInt(localStorage.getItem("lastMenuPage") || "0"));
    }
  }, []);

  return (
    <>
      {showModalLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {showModal && (
        <TourExamplesModal
          page={tourPage}
          setShowModal={toggleModal}
          examples={examples}
          showModalLoading={toggleModalLoading}
        />
      )}
      <div
        className={
          "flex flex-col items-center justify-center w-full h-full gap-4 mt-12 "
        }
      >
        <div className={"flex w-full flex-col items-center justify-center "}>
          <h1 className="transition-all font-sans font-extrabold antialiased text-transparent bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400 text-5xl md:text-6xl">
            neXSim
          </h1>
          <div className="flex-row w-full justify-start items-start px-12 mt-6 lg:mt-0 mb-6">
            <div className="w-full flex justify-start items-center mb-6">
              <h1 className="text-3xl font-bold">
                User guide - {tourPages[tourPage]}
              </h1>
            </div>

            <div className="w-full h-fit mt-9">
              <div className="w-full flex gap-8">
                <div className="hidden w-1/5 lg:flex flex-col gap-8 mt-3">
                  {tourPage !== 0 && (
                    <AuxButton
                      text="Search Your Entities"
                      callback={() => {
                        localStorage.setItem("lastMenuPage", "0");
                        setTourPage(0);
                      }}
                      icon=""
                    />
                  )}
                  {tourPage === 0 && (
                    <Button
                      text="Try Search"
                      icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
                      callback={() => {
                        router.push("/");
                      }}
                    />
                  )}
                  {tourPage !== 1 && (
                    <AuxButton
                      text="Dashboard"
                      callback={() => {
                        localStorage.setItem("lastMenuPage", "1");
                        setTourPage(1);
                      }}
                      icon=""
                    />
                  )}
                  {tourPage === 1 && (
                    <Button
                      text="Try Dashboard"
                      icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
                      callback={toggleModal}
                    />
                  )}
                  {tourPage !== 2 && (
                    <AuxButton
                      text="Summary"
                      callback={() => {
                        localStorage.setItem("lastMenuPage", "2");
                        setTourPage(2);
                      }}
                      icon=""
                    />
                  )}
                  {tourPage === 2 && (
                    <Button
                      text="Try Summary"
                      icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
                      callback={toggleModal}
                    />
                  )}
                  {tourPage !== 3 && (
                    <AuxButton
                      text="Similar Entities"
                      callback={() => {
                        localStorage.setItem("lastMenuPage", "3");
                        setTourPage(3);
                      }}
                      icon=""
                    />
                  )}
                  {tourPage === 3 && (
                    <Button
                      text="Try Similar Entities"
                      icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
                      callback={toggleModal}
                    />
                  )}
                </div>

                <div className="w-full lg:w-4/5 h-[85%] px-3 py-3 overflow-y-scroll overflow-x-hidden">
                  {tourPage === 0 && (
                    <TourSearchPage showExamples={toggleModal} />
                  )}
                  {tourPage === 1 && (
                    <TourCharacterization showExamples={toggleModal} />
                  )}
                  {tourPage === 2 && <TourSummary showExamples={toggleModal} />}
                  {tourPage === 3 && <TourExpand showExamples={toggleModal} />}
                  {
}
                </div>
              </div>
              <div className="flex flex-row justify-center gap-8 mt-12 mb-12 w-full">
                <div>
                  {tourPage > 0 && (
                    <AuxButton
                      text="Previous"
                      callback={() => {
                        localStorage.setItem(
                          "lastMenuPage",
                          String(tourPage - 1)
                        );
                        setTourPage(tourPage - 1);
                      }}
                      icon=""
                    />
                  )}
                </div>
                <div>
                  {tourPage < 3 && (
                    <AuxButton
                      text="Next"
                      callback={() => {
                        localStorage.setItem(
                          "lastMenuPage",
                          String(tourPage + 1)
                        );
                        setTourPage(tourPage + 1);
                      }}
                      icon=""
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
