"use client";

import Button from "@/app/ui/button";
import { useState } from "react";
import SecondaryButton from "./secondary_button";

export default function BottomDrawer({
  unitSize,
  primaryCallback,
}: {
  unitSize: number;
  primaryCallback: () => void;
}) {
  const [visible, setVisible] = useState(true);

  return (
    <div
      className={
        "overflow-auto transition-all w-10/12 fixed flex flex-col bottom-0 pb-3 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-b-0 border-slate-300 dark:border-slate-600 rounded-t-lg shadow-lg dark:shadow-slate-600/40 " +
        (visible ? "transform-none " : "translate-y-[calc(100%-1.7rem)] ") +
        (unitSize > 0 ? "show" : "hidden")
      }
    >
      <div
        className="transition-all hover:bg-slate-100 dark:hover:bg-slate-700 flex w-full py-3"
        onClick={() => {
          setVisible(!visible);
        }}
      >
        <div
          className={
            "w-20 h-1 align-center mx-auto rounded-lg bg-slate-300 dark:bg-slate-500 " +
            (!visible ? "animate-ping-once" : "")
          }
        ></div>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 place-content-between px-5 mt-2">
        <div className="flex flex-col">
          <span className="transition-all text-transparent w-fit text-lg md:text-xl font-bold bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400">
            {unitSize +
              (unitSize == 1 ? " entity is" : " entities are") +
              " selected"}
          </span>
          <span className="text-md font-semibold text-slate-400">
            Add entities or proceed to choose which properties you are
            interested in
          </span>
        </div>
        <div className="flex gap-4 w-fit h-fit self-end md:self-auto items-center">
          {
}
          <Button
            text="Proceed"
            icon="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"
            callback={primaryCallback}
          />
        </div>
      </div>
    </div>
  );
}
