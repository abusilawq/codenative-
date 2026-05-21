"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { RepoTourFile } from "@/lib/types";

interface Props {
  files: RepoTourFile[];
  onNodeClick: (file: RepoTourFile) => void;
}

interface TreeNode {
  name: string;
  path: string;
  file?: RepoTourFile;
  children?: TreeNode[];
}

const CATEGORY_COLORS: Record<RepoTourFile["category"], string> = {
  config: "#60a5fa",
  source: "#34d399",
  docs: "#fbbf24",
  tests: "#a78bfa",
  assets: "#f472b6",
  other: "#94a3b8",
};

function buildTree(files: RepoTourFile[]): TreeNode {
  const root: TreeNode = { name: "root", path: "", children: [] };
  for (const f of files) {
    const parts = f.path.split("/");
    let current = root;
    parts.forEach((part, i) => {
      const isLast = i === parts.length - 1;
      current.children = current.children ?? [];
      let next = current.children.find((c) => c.name === part);
      if (!next) {
        next = {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
          ...(isLast ? { file: f } : { children: [] }),
        };
        current.children.push(next);
      }
      current = next;
    });
  }
  return root;
}

export function RepoTree({ files, onNodeClick }: Props) {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current || files.length === 0) return;

    const root = buildTree(files);
    const width = ref.current.clientWidth;
    const height = Math.max(600, files.length * 18);

    const tree = d3.tree<TreeNode>().size([height - 100, width - 280]);
    const hierarchy = d3.hierarchy(root);
    const layout = tree(hierarchy);

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", width).attr("height", height);

    const g = svg.append("g").attr("transform", "translate(100, 50)");

    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.12)")
      .attr("stroke-width", 1)
      .selectAll("path")
      .data(layout.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
          .x((d) => d.y)
          .y((d) => d.x)
      );

    const node = g
      .append("g")
      .selectAll("g")
      .data(layout.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`)
      .style("cursor", (d) => (d.data.file ? "pointer" : "default"))
      .on("click", (_, d) => {
        if (d.data.file) onNodeClick(d.data.file);
      });

    node
      .append("circle")
      .attr("r", (d) => {
        if (!d.data.file) return 5;
        return Math.max(4, Math.min(14, d.data.file.importance * 1.3));
      })
      .attr("fill", (d) => (d.data.file ? CATEGORY_COLORS[d.data.file.category] : "#1e2954"))
      .attr("stroke", (d) => (d.data.file ? CATEGORY_COLORS[d.data.file.category] : "#727da0"))
      .attr("stroke-width", 2)
      .attr("fill-opacity", (d) => (d.data.file ? 0.25 : 1))
      .append("title")
      .text((d) => d.data.file?.description ?? d.data.name);

    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => (d.children ? -10 : 10))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("fill", "rgba(255,255,255,0.85)")
      .attr("font-family", "var(--font-jetbrains), monospace")
      .attr("font-size", 11)
      .text((d) => d.data.name)
      .clone(true)
      .lower()
      .attr("stroke", "#0A0E27")
      .attr("stroke-width", 3);
  }, [files, onNodeClick]);

  return (
    <div className="overflow-auto rounded-2xl glass">
      <svg ref={ref} className="min-w-full" />
    </div>
  );
}
