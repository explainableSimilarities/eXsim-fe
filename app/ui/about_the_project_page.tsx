"use client";

import ReferencesComponent from "./references_component";
import TechnologiesComponent from "./technologies_component";
import { useRouter } from "next/navigation";

export default function AboutTheProjectPage() {
  const router = useRouter();
  const references = [
    {
      "title":
        "A logic-based framework for characterizing nexus of similarity within knowledge bases.",
      "authors": ["G. Amendola", "M. Manna", "A. Ricioppo"],
      "doi": "https://doi.org/10.1016/j.ins.2024.120331",
      "bib": `@article{AMENDOLA2024120331,
        title = {A logic-based framework for characterizing nexus of similarity within knowledge bases},
        journal = {Information Sciences},
        volume = {664},
        pages = {120331},
        year = {2024},
        issn = {0020-0255},
        doi = {https://doi.org/10.1016/j.ins.2024.120331},
        url = {https://www.sciencedirect.com/science/article/pii/S0020025524002445},
        author = {Giovanni Amendola and Marco Manna and Aldo Ricioppo},
        keywords = {Logic-based framework, Formal semantics, Nexus of similarity, Knowledge bases, Computational complexity},
        abstract = {Similarities play a pivotal role in diverse real-world scenarios, driving extensive research into methodologies for measuring entity similarity and expanding sets of entities with similar ones. Machines are nowadays adept at performing these tasks by taking in some regard relevant interconnected properties shared by entities, which we term nexus of similarity. To the best of our knowledge, however, there lacks a general logic-based framework for ‘characterizing’ nexus of similarity between (tuples of) entities within a given relational knowledge base represented via some arbitrary formalism. Essentially, there is no way to formally express such nexus in a comprehensive and concise manner, making them understandable to both machines and humans. Moreover, the classical notion of expanding a set of entities overlooks the inherent human tendency to naturally generalize entities in a taxonomic way. In light of what was discussed above, we introduce the novel notion of selective knowledge base, denoted by S=(K,ς), designed to enhance any pre-existing relational knowledge base K with a summary selector ς. For any tuple τ of entities, ς selects a relevant portion of the knowledge entailed by K that describes τ. Subsequently, we design a nexus explanation language, called NCF, with an associated semantics. This allows us to delve into the task of explaining and characterizing the nexus of similarity among (tuples of) entities within a selective knowledge base. Then, we introduce the notions of explanation, characterization, canonical characterization, and core characterization, demonstrating that they always exist and are computable. Furthermore, we introduce the notions of essential expansion and expansion graph, formally generalizing the classical notion of linear expansions by showcasing that expansions are naturally taxonomic. We also study key reasoning tasks related to the computation of characterizations and expansions, and analyze their tractability under various computational assumptions. Finally, we contextualize our framework within the existing literature by exploring related technical problems, analyze our design choices in a critical way, and investigate the adaptability and effectiveness of our approach in real-world scenarios.}
        }`,
    },
    {
      "title":
        "Characterizing Nexus of Similarity within Knowledge Bases: A Logic-based Framework and its Computational Complexity Aspects.",
      "authors": ["G. Amendola", "M. Manna", "A. Ricioppo"],
      "doi": "https://doi.org/10.48550/arXiv.2303.10714",
      "bib": `@article{DBLP:journals/corr/abs-2303-10714,
      author       = {Giovanni Amendola and
                      Marco Manna and
                      Aldo Ricioppo},
      title        = {Characterizing Nexus of Similarity within Knowledge Bases: {A} Logic-based
                      Framework and its Computational Complexity Aspects},
      journal      = {CoRR},
      volume       = {abs/2303.10714},
      year         = {2023},
      url          = {https://doi.org/10.48550/arXiv.2303.10714},
      doi          = {10.48550/ARXIV.2303.10714},
      eprinttype    = {arXiv},
      eprint       = {2303.10714},
      timestamp    = {Wed, 22 Mar 2023 14:41:36 +0100},
      biburl       = {https://dblp.org/rec/journals/corr/abs-2303-10714.bib},
      bibsource    = {dblp computer science bibliography, https://dblp.org}
    }`,
    },
    {
      title: "Characterizing Nexus of Similarity between Entities.",
      authors: [
        "G. Agresta",
        "G. Amendola",
        "P. Cofone",
        "M. Manna",
        "A. Ricioppo",
      ],
      doi: "https://ceur-ws.org/Vol-3585/paper6_RCRA5.pdf",
      bib: `@inproceedings{DBLP:conf/aiia/AgrestaACMR23,
      author       = {Giuseppe Agresta and
                      Giovanni Amendola and
                      Pietro Cofone and
                      Marco Manna and
                      Aldo Ricioppo},
      editor       = {Riccardo De Benedictis and
                      Matteo Castiglioni and
                      Diodato Ferraioli and
                      Vadim Malvone and
                      Marco Maratea and
                      Enrico Scala and
                      Luciano Serafini and
                      Ivan Serina and
                      Elisa Tosello and
                      Alessandro Umbrico and
                      Mauro Vallati},
      title        = {Characterizing Nexus of Similarity between Entities},
      booktitle    = {Proceedings of the the Italian Workshop on Planning and Scheduling,
                      {RCRA} Workshop on Experimental evaluation of algorithms for solving
                      problems with combinatorial explosion, and {SPIRIT} Workshop on Strategies,
                      Prediction, Interaction, and Reasoning in Italy {(IPS-RCRA-SPIRIT}
                      2023) co-located with 22nd International Conference of the Italian
                      Association for Artificial Intelligence AIxIA 2023, November 7-9th,
                      2023, Rome, Italy},
      series       = {{CEUR} Workshop Proceedings},
      volume       = {3585},
      publisher    = {CEUR-WS.org},
      year         = {2023},
      url          = {https://ceur-ws.org/Vol-3585/paper6\_RCRA5.pdf},
      timestamp    = {Tue, 02 Jan 2024 17:44:44 +0100},
      biburl       = {https://dblp.org/rec/conf/aiia/AgrestaACMR23.bib},
      bibsource    = {dblp computer science bibliography, https://dblp.org}
    }`,
    },
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 mt-12">
        <div className="flex flex-col items-center justify-center h-1/3">
          
          <h1 className="transition-all font-sans font-extrabold antialiased text-transparent bg-clip-text bg-gradient-to-r from-unical-red-700 to-unical-red-400 dark:from-unical-red-600 dark:to-unical-red-400 text-5xl md:text-6xl">
            neXSim
          </h1>
          <div className="flex-row w-full justify-start items-start px-12 mt-6 lg:mt-0 mb-6">
            <div className="w-full flex justify-start items-center">
              <h1 className="text-3xl font-bold">About This Project</h1>
            </div>
            <div className="w-full h-fit lg:h-32 lg:overflow-y-scroll mt-3">
              <span className="pt-12">
                Nowadays, discovering new entities similar to ones already
                aligned with users' preferences is a common and challenging
                task. However, typically, users are not inclined to express
                their tastes explicitly, so extracting such information as
                similarities among entities they already approved is crucial.
                Various recommendation systems move in this direction, but
                relying on machine learning and statistical techniques, they
                lack in supporting their output via a user-readable explanation.
                Accordingly, recent research introduced a theoretical deductive
                logic-based framework to formally express similarity among a set
                of entities (tuples of entities), compare and expand the latter
                with others sharing the same nexus of similarity or a more
                generic one. This work proposes a practical application of this
                framework, proving its feasibility by implementing RESTful APIs
                integrated into a web-based system to characterize similarities
                among entities and, later, recommend new ones according to their
                nexus of similarity while providing a formal and well-formed
                explanation. For this purpose, the system draws upon a knowledge
                base with data extracted from a prior version of the well-known
                BabelNet knowledge graph. Yet, its intrinsic design allows it to
                adapt and operate over a generic knowledge base.
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col lg:flex-row gap-4 h-1/3 pb-9 px-9 overflow-y-scroll">
          <ReferencesComponent references={references} />
          <TechnologiesComponent />
        </div>
      </div>
    </>
  );
}
