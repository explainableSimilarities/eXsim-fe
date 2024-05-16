"use client";

export default function TechnologiesComponent() {
  return (
    <>
      <div className="flex h-96 w-full lg:w-1/2 flex-col justify-start border border-slate-300 dark:border-slate-600 rounded-lg pt-4 pl-4 pr-4">
        <div className="w-full h-fit flex flex-col justify-start mb-6">
          <div className="flex flex-start gap-4">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875Z" />
                <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 0 0 1.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 0 0 1.897 1.384C6.809 12.164 9.315 12.75 12 12.75Z" />
                <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 15.914 9.315 16.5 12 16.5Z" />
                <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 0 0 1.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 0 0 1.897 1.384C6.809 19.664 9.315 20.25 12 20.25Z" />
              </svg>
            </span>
            <h2 className="text-xl font-bold">Acknowledgments</h2>
          </div>
        </div>
        <div className="overflow-y-scroll">
          <div className="h-fit flex flex-col w-full gap-4 lg:pl-9 pr-3 mb-6">
            <div className="grid bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg grid-row-2 gap-4 lg:w-full px-6 py-6">
              <div className="flex flex-row w-fit gap-4 items-center">
                <div
                  className="min-w-7 min-h-7 bg-contain bg-no-repeat bg-center"
                  style={{ backgroundImage: `url("/babelnet.svg")` }}
                ></div>
                <span>
                  In this version of neXSim, the underlying Knowledge Base
                  relies on{" "}
                  <span
                    className="hover:cursor-pointer hover:text-unical-red-900 font-bold"
                    onClick={() => {
                      window.open("https://babelnet.org/");
                    }}
                  >
                    BabelNet
                  </span>{" "}
                  4.0.1
                </span>
              </div>
            </div>
          </div>
          <div className="h-fit flex flex-col w-full gap-4 lg:pl-9 pr-3 mb-6">
            <div className="grid bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg grid-row-2 gap-4 lg:w-full px-6 py-6">
              <div className="flex flex-row w-fit gap-4">
                <span className="text-sm">
                  This work was funded by the following two projects under the
                  NextGenerationEU NRRP MUR (The Italian Ministry for
                  Universities and Research) program: FAIR - Future AI Research
                  (PE00000013), Spoke 9 - Green-aware AI, and Tech4You -
                  Technologies for climate change adaptation and quality of life
                  improvement (ECS0000009), call for the creation and
                  strengthening of ‘Innovation Ecosystems’, building
                  ‘Territorial R&D Leaders’.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
