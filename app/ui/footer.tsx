"use client";

export default function Footer() {
  return (
    <footer className="z-[1000] fixed bottom-0 px-12 h-8 flex items-center justify-start xl:justify-between w-full h-16 bg-unical-red-900 font-bold text-slate-50 dark:bg-unical-red-50 dark:text-slate-900">
      <span className="hidden xl:block">
        This work implements <span className="text-slate-400 hover:text-slate-300"><a href="https://doi.org/10.1016/j.ins.2024.120331">Nexus of Similarity</a></span> framework // Developed at <span className="text-slate-400 hover:text-slate-300"><a href="https://demacs.unical.it/">DEMACS@Unical</a></span> // Data is coming from {" "}
        <span className="text-slate-400 hover:text-slate-300">
          <a href="https://www.babelnet.org">Babelnet</a>
        </span>{" "}
        version 4.0.1
      </span>
      <span className="flex w-72 xl:w-fit justify-between">
      <span className="text-slate-400 xl:mr-3 hover:text-slate-300">
          <a href="about-the-project">About This Project</a>
        </span>
        <span className="text-slate-400 hover:text-slate-300">
          <a href="contacts">Contacts</a>
        </span>
        </span>
    </footer>
  );
}
