"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TourEntry({ page }: { page: number }) {
  const router = useRouter();
  const [showText, setShowText] = useState(false);
  return (
    <>
      <div
        className="flex pl-3 pr-3 hover:pr-4 w-fit items-center gap-3 fixed top-24 right-2 md:right-16 md:top-16 h-12 gap-3 z-[1000] text-unical-red-800 hover:text-unical-red-900 bg-unical-red-900/[0.2] hover:bg-unical-red-600/[0.3] hover:cursor-pointer border rounded-lg shadow-lg transition-all" onPointerEnter={(e) => {
          setShowText(true);
        }}
        onPointerLeave={(e) => {
          setShowText(false);
        }}
        onClick={() => {
          localStorage.setItem("lastMenuPage",String(page));
          router.push(`/tour/`);
        }}
      >

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
            clipRule="evenodd"
          />
        </svg>
        {showText && <span className="text-base font-bold transition-all">Need Some Help?</span>}
      </div>
    </>
  );
}
