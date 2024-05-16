"use client";

import { useRouter } from "next/navigation";
import AuxButton from "./aux_button";

export default function ContactsPage() {
  const router = useRouter();
  const people = [
    {
      name: "Marco Manna",
      role: "Full Professor",
      email: "marco.manna@unical.it",
    },
    {
      name: "Giovanni Amendola",
      role: "Associate Professor",
      email: "giovanni.amendola@unical.it",
    },
    {
      name: "Aldo Ricioppo",
      role: "Postdoc",
      email: "aldo.ricioppo@unical.it",
    },
    {
      name: "Giuseppe Agresta",
      role: "PhD Student",
      email: "giuseppe.agresta@unical.it",
    },
    {
      name: "Pietro Cofone",
      role: "PhD Student",
      email: "pietro.cofone@unical.it",
    },
  ];

  const sendMail = (addr: string | undefined) => {
    window.open(
      addr !== undefined
        ? `mailto:${addr}`
        : `mailto:${people.map((p) => p.email).join(",")}`
    );
  };

  const backToCaller = (caller: string) => {
    router.push(caller);
  };
  const elements = people.map((person, index) => {
    return (
      <div
        key={index}
        className="grid bg-slate-100 dark:bg-slate-800 lg:bg-transparent border border-slate-300 dark:border-slate-600 rounded-lg lg:border-none grid-row-3 lg:grid-cols-3 gap-4 lg:w-full px-6 py-6 lg:py-3"
      >
        <div className="flex flex-row w-fit gap-4">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span>{person.name}</span>
        </div>
        <div className="flex flex-row w-fit gap-4">
          <span>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
              <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
              <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
            </svg>
          </span>
          <span>{person.role} </span>
        </div>
        <div
          key={index}
          className="flex flex-row w-fit gap-4 hover:text-unical-red-900 hover:cursor-pointer"
          onClick={(e) => {
            sendMail(person.email);
          }}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
            </svg>
          </span>
          <span>{person.email}</span>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-12">
        
        <h1 className="transition-all font-sans font-extrabold antialiased text-transparent bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400 text-5xl md:text-6xl">
          neXSim
        </h1>
        <div className="flex-row w-full h-full justify-start items-start px-12 py-6">
          <div className="w-full flex justify-start items-center gap-3 mb-9">
            <h1 className="text-3xl font-bold">Contacts</h1>
          </div>
          <div className="w-full flex justify-start items-center gap-3 mb-12 pl-9">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <h2 className="text-xl font-bold">
              Department of Mathematics and Computer Science - University of
              Calabria
            </h2>
          </div>
          <div className="w-full flex-row justify-start items-start gap-3 mb-12 pl-9">
            <div className="w-full flex justify-start items-center gap-3 mb-9">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z"
                  clipRule="evenodd"
                />
              </svg>

              <h2 className="text-xl font-bold">People:</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 lg:grid-row-1 w-full gap-4 lg:gap-0 lg:pl-9 mb-12">
              {elements}
            </div>
          </div>
          <div className="w-full grid grid-cols-1 grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-12 pl-9 h-6 mb-12 lg:mb-9">
            <div
              className="flex justify-start items-center gap-3 w-fit hover:text-unical-red-900 hover:cursor-pointer"
              onClick={() => {
                router.push("/about-the-project");
              }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.04 16.5.5-1.5h6.42l.5 1.5H8.29Zm7.46-12a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm-3 2.25a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 1.5 0V9Zm-3 2.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <h2 className="text-lg font-bold">
                Learn More About This Project
              </h2>
            </div>

            <div
              className="flex justify-start items-center gap-3 w-fit hover:text-unical-red-900 hover:cursor-pointer"
              onClick={() => {
                sendMail(undefined);
              }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
              </span>
              <h2 className="text-lg font-bold">
                Have some questions? Contact us!
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
