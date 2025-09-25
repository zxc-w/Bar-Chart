import { useState, useEffect } from "react";
import * as d3 from "d3";
import "./App.css";

function App() {
  const [dataset, setDataset] = useState([]);
  const formatDate = d3.timeFormat("%Y-%m-%d");
  const svg = d3.select("svg");
  const tooltip = d3.select("#tooltip");
  const padding = 50;
  const w = 1000;
  const h = 600;

  svg
    .attr("viewBox", `0 0 ${w} ${h}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("svg-content", true);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    )
      .then((res) => res.json())
      .then((res) => {
        const parseDate = d3.timeParse("%Y-%m-%d");
        const data = res.data.map((d) => [parseDate(d[0]), d[1]]);
        setDataset(data);
      });
  }, []);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, (d) => d[0]))
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.attr("width", w).attr("height", h);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  svg
    .selectAll("rect")
    .data(dataset)
    .join("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => formatDate(d[0]))
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d) => xScale(d[0]))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", w / dataset.length)
    .attr("height", (d) => h - padding - yScale(d[1]))
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 1)
        .attr("data-date", formatDate(d[0]))
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 40 + "px")
        .html(`${formatDate(d[0])}<br/>$${d[1].toString()} Billion`);
    })
    .on("mouseout", () => tooltip.style("opacity", 0));
  return (
    <>
      <h1 id="title">U.S.A GDP</h1>
      <svg></svg>
      <div id="tooltip"></div>
    </>
  );
}

export default App;
