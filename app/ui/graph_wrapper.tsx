import dynamic from "next/dynamic";

const MyGraph = dynamic(() => import("./graph"), {
  ssr: false
});

export default MyGraph;
