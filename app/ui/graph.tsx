'use client';

import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
import React, { useEffect, useRef, useState } from "react";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { Formula, Predicate, PredicateType, Term, TermType } from '../models/models';
import { useRouter } from 'next/navigation';

export default function MyGraph({ width, height, formula, terms, nodeLimit, seeMore, exploreVar, toAggregate = true}: { width: number, height: number, formula: Formula, terms: Term[], nodeLimit: number, seeMore: (t:Term) => void, exploreVar: (predicates:string[], boundVar:Term) => void, toAggregate?:boolean}) {
  const [nodes, setNodes] = useState([] as any[]);
  const [links, setLinks] = useState([] as any[]);
  const fgRef = useRef<ForceGraphMethods>();
  const router = useRouter();
  const internalFormula = (toAggregate ? formula.collapse() : formula);

  useEffect(() => {
    if (fgRef.current) {
      let force = fgRef.current.d3Force("link")

      if (force) {
        force.distance(80);
      }

      fgRef.current.zoomToFit(300);
    }


    let foundTerms = [] as string[];
    let otherPredicatesNumber = 0;
    let boundVars = 0;
    const tmpNodes = internalFormula?.predicates.flatMap((predicate) => {
      let tmp = [] as any[];

      if (nodeLimit != -1 && otherPredicatesNumber >= nodeLimit) {
        return []
      }

      let bothAlreadyIn = true;

      predicate.terms.forEach((term) => {
        if (!foundTerms.includes(term.name.join(","))) {
          foundTerms.push(term.name.join(","));

          if(term.type == TermType.BOUND_VARIABLE) {
            tmp.push({ id: term.name.join(","), fullObj: term, varId: boundVars++});
          }
          else {
            tmp.push({ id: term.name.join(","), fullObj: term });
          }
          bothAlreadyIn = false;
        }
      })

      if (predicate.type == PredicateType.OTHER && !bothAlreadyIn) {
        otherPredicatesNumber++;
      }
      return tmp;
    });

    const tmpLinks = internalFormula?.predicates.reduce((result, predicate) => {
      if (!predicate.terms.every((t) => { return foundTerms.includes(t.name.join(",")) })) {
        return result;
      }

      let newLink = { source: predicate.terms[0].name.join(","), target: predicate.terms[1].name.join(","), predName: normalizePredicateName(predicate.name) }
      let index = result.findIndex((e) => { return e.source == newLink.source && e.target == newLink.target })

      if (index == -1) {
        result.push(newLink);
      }
      else {
        if (!result[index].predName.split(",").includes(normalizePredicateName(newLink.predName)))
          result[index].predName = result[index].predName + ", " + normalizePredicateName(newLink.predName);
      }
      return result;
    }, [] as any[]);

    setNodes(tmpNodes);
    setLinks(tmpLinks);
  }, []);

  function normalizeString(mainSense: string) {
    mainSense = mainSense.replaceAll("_", " ");
    return mainSense.charAt(0).toUpperCase() + mainSense.slice(1);
  }

  function normalizePredicateName(str: string) {
    if (str == "HYPER")
      return "is a";

    str = str.replaceAll("_", " ");
    return str.toLowerCase();
  }

  const data = { nodes: nodes, links: links }

  const extraRenderers = [new CSS2DRenderer()];
  return (
    <>
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        width={width}
        height={height}
        backgroundColor={"rgba(0,0,0,0)"}
        cooldownTicks={100}
        nodeOpacity={0}
        nodeRelSize={6}

        linkDirectionalArrowLength={6.5}
        linkDirectionalArrowRelPos={0.9}
        linkCurvature={0}
        linkDirectionalArrowColor={() => (
"rgb(71, 85, 105)")}
        linkColor={() => (
"rgb(71, 85, 105)")}
        showNavInfo={false}
        // @ts-ignore: Unreachable code error
        extraRenderers={extraRenderers}
        nodeThreeObject={(node: any) => {
          let myNode = node.fullObj as Term;
          if (myNode.type == TermType.CONSTANT) {
            const nodeEl = document.createElement('div');
            let full_term = terms.find((t) => {
              return t.name[0] == myNode.name[0]
            });

            nodeEl.innerHTML = "<img class='node-img' src='" + full_term?.babelNetEntity?.image_url + "'></img><span>" + normalizeString(full_term?.babelNetEntity?.main_sense || "") + "</span>"


            nodeEl.style.color = node.color;
            nodeEl.className = 'node-label';
            return new CSS2DObject(nodeEl);
          }
          else if (myNode.type == TermType.AGGREGATED_TERM) {
            const nodeEl = document.createElement('div');
            let full_term0 = terms.find((t) => {
              return t.name[0] == myNode.name[0]
            });


            /*let full_term1 = terms.find((t) => {
              return t.name[0] == myNode.name[1]
            });*/

            //nodeEl.innerHTML = "<div class='node-img' style='background-image: url(" + full_term0?.babelNetEntity?.image_url + "), url(/default.svg);'></div><span>...</span><div class='node-img' style='background-image: url(" + full_term1?.babelNetEntity?.image_url + "), url(/default.svg);'></div>"
            /*nodeEl.innerHTML = "<img class='node-img' src='" + full_term0?.babelNetEntity?.image_url + "'></img><span>...</span><img class='node-img' src='" + full_term1?.babelNetEntity?.image_url + "'></img>"*/

            
            /*let full_term1 = terms.find((t) => {
              return t.name[0] == myNode.name[1]
            });*/

            //nodeEl.innerHTML = "<div class='node-img' style='background-image: url(" + full_term0?.babelNetEntity?.image_url + "), url(/default.svg);'></div><span>...</span><div class='node-img' style='background-image: url(" + full_term1?.babelNetEntity?.image_url + "), url(/default.svg);'></div>"
            /*nodeEl.innerHTML = "<img class='node-img' src='" + full_term0?.babelNetEntity?.image_url + "'></img><span>...</span><img class='node-img' src='" + full_term1?.babelNetEntity?.image_url + "'></img>"*/

            nodeEl.innerHTML = "<img class='node-img' src='" + full_term0?.babelNetEntity?.image_url + "'></img><span>" + normalizeString(full_term0?.babelNetEntity?.main_sense || "") + "<span class='node-others'> and " + (myNode.name.length - 1) + " more</span></span>"            

            nodeEl.style.color = node.color;
            nodeEl.className = 'node-label';
            return new CSS2DObject(nodeEl);
          }
          else if (myNode.type == TermType.FREE_VARIABLE) {
            const nodeEl = document.createElement('div');

            nodeEl.innerHTML = "<span>Your entities</span>"

            nodeEl.style.color = node.color;
            nodeEl.className = 'node-label';
            return new CSS2DObject(nodeEl);
          }
          else {
            const nodeEl = document.createElement('div');

            nodeEl.innerHTML = "<span class='node-others'>?y" + node.varId + "</span>"

            nodeEl.style.color = node.color;
            nodeEl.className = 'node-label';
            return new CSS2DObject(nodeEl);
          }
        }}
        nodeThreeObjectExtend={true}
        linkThreeObjectExtend={true}
        linkThreeObject={(link: any) => {

          const nodeEl = document.createElement('div');
          nodeEl.innerHTML = "<span>" + link.predName + "</span>"

          nodeEl.className = 'link-label';
          return new CSS2DObject(nodeEl);
        }}
        linkPositionUpdate={(sprite, { start, end }) => {
          const coords = ['x', 'y', 'z'] as const
          const middlePos = Object.assign({}, ...coords.map(c => ({
            [c]: start[c] + (end[c] - start[c]) / (2) // calc middle point
          })));

          Object.assign(sprite.position, middlePos);
        }}
        onNodeClick={(node) => {
          const distance = 80;
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

          const newPos = node.x || node.y || node.z
            ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

          if (fgRef.current) {
            fgRef.current.cameraPosition(
              newPos, // new position
              node, // lookAt ({ x, y, z })
              3000  // ms transition duration
            );
          }

          let myNode = node.fullObj as Term;
          if (myNode.type == TermType.CONSTANT) {
            router.push("/" + node.id);
          }
          else if (myNode.type == TermType.AGGREGATED_TERM) {
            seeMore(myNode);
          }
          else if (myNode.type == TermType.BOUND_VARIABLE) {
            let involvedPredicates = internalFormula?.predicates.filter((p) => {
              return p.terms[1].name.join(",") == node.id;
            }).map((p) => {
              return p.name;
            });
            exploreVar(involvedPredicates, myNode);
          }
        }}
      />
    </>
  );
}
