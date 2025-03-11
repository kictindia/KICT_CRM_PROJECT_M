

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import axios from "axios";

const FranchiseChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching data from the backend (e.g., franchise data)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://franchiseapi.kictindia.com/franchise/all");
        const formattedData = formatDataForSunburst(response.data);
        setData(formattedData);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format data into hierarchical structure
  const formatDataForSunburst = (franchiseData) => {
    const stateData = franchiseData.reduce((acc, franchise) => {
      if (!acc[franchise.State]) {
        acc[franchise.State] = {
          name: franchise.State,
          children: [],
        };
      }

      const city = franchise.City;
      const existingCity = acc[franchise.State].children.find(
        (child) => child.name === city
      );

      if (existingCity) {
        existingCity.value += 1;
      } else {
        acc[franchise.State].children.push({
          name: city,
          value: 1,
        });
      }

      return acc;
    }, {});

    return Object.values(stateData).map((state) => ({
      name: state.name,
      children: state.children,
    }));
  };

  // Generate a dynamic color palette
  const generateColors = () => {
    const colors = [
      "#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1",
      "#955251", "#B565A7", "#009B77", "#DD4124", "#45B8AC",
    ];
    return colors;
  };

  useEffect(() => {
    if (!chartRef.current || loading || error || !data.length) return;

    const chart = echarts.init(chartRef.current);
    const colors = generateColors();

    const sunburstOption = {
      title: {
        text: "Franchise Distribution",
        left: "center",
        textStyle: {
          fontSize: 10,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c}",
      },
      series: [
        {
          type: "sunburst",
          data: data,
          radius: [0, "90%"],
          label: {
            rotate: "radial",
            fontSize: 8,
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
          },
          color: colors, // Dynamic color palette
        },
      ],
    };

    chart.setOption(sunburstOption);

    // Handle responsiveness
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [data, loading, error]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "60vh",
        minWidth: "250px",
        maxWidth: "100%",
        margin: "0 auto",
      }}
    />
  );
};

export default FranchiseChart;


// import React, { useEffect, useRef, useState } from "react";
// import * as echarts from "echarts";
// import axios from "axios";

// const FranchiseChart = () => {
//   const chartRef = useRef(null);
//   const [franchiseData, setFranchiseData] = useState({
//     states: [],
//     franchiseCounts: [],
//     franchiseNames: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch franchise data from the API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("https://franchiseapi.kictindia.com/franchise/all");
//         setFranchiseData(formatDataForChart(response.data));
//       } catch (err) {
//         setError("Failed to fetch data");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Format the franchise data to match the bar chart structure
//   const formatDataForChart = (data) => {
//     const formattedData = data.reduce((acc, franchise) => {
//       const state = franchise.State;
//       const name = franchise.Name; // Get franchise name
//       if (!acc[state]) {
//         acc[state] = { count: 0, names: [] };
//       }
//       acc[state].count += 1;
//       acc[state].names.push(name); // Add franchise name to the state
//       return acc;
//     }, {});

//     // Convert to arrays of states, franchise counts, and franchise names
//     const states = Object.keys(formattedData);
//     const franchiseCounts = states.map((state) => formattedData[state].count);
//     const franchiseNames = states.map((state) =>
//       formattedData[state].names.join(", ")
//     ); // Join names as a string

//     return { states, franchiseCounts, franchiseNames };
//   };

//   useEffect(() => {
//     if (!chartRef.current || loading || error || !franchiseData.states.length)
//       return;

//     const chart = echarts.init(chartRef.current);

//     // Bar Chart Option
//     const option = {
//       title: {
//         text: "Franchise Distribution by State (Bar Chart)",
//         left: "center",
//         top: "top",
//       },
//       tooltip: {
//         trigger: "item",
//         formatter: (params) => {
//           const state = params.name;
//           const franchiseCount = params.value;
//           return `${state}: ${franchiseCount} franchises`; // Customize tooltip text
//         },
//       },
//       xAxis: {
//         type: "category",
//         data: franchiseData.states,
//         axisLabel: {
//           rotate: 45, // Rotate the labels to avoid overlap
//           interval: 0, // Ensure that every label is shown
//         },
//         axisLine: {
//           lineStyle: {
//             color: "#aaa", // Color of the axis line
//           },
//         },
//       },
//       yAxis: {
//         type: "value",
//         name: "Franchises",
//         axisLine: {
//           lineStyle: {
//             color: "#aaa", // Color of the axis line
//           },
//         },
//         axisLabel: {
//           formatter: "{value} franchises",
//         },
//       },
//       series: [
//         {
//           name: "Franchises",
//           type: "bar", // Set chart type to 'bar'
//           data: franchiseData.franchiseCounts, // Data for the bars
//           itemStyle: {
//             color: "#3498db", // Color of the bars
//           },
//           barWidth: "40%", // Width of the bars
//           emphasis: {
//             focus: "series", // Highlight bars on hover
//           },
//         },
//       ],
//       animationDurationUpdate: 1000,
//       animationEasingUpdate: "cubicInOut",
//     };

//     // Set the initial option
//     chart.setOption(option);

//     // Cleanup on component unmount
//     return () => {
//       chart.dispose(); // Dispose the chart to prevent memory leaks
//     };
//   }, [franchiseData, loading, error]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

// //   return <div ref={chartRef} style={{ width: "100%", height: "50vh" }} />
// // };

// // export default FranchiseChart;

// import React, { useEffect, useRef, useState } from "react";
// import * as echarts from "echarts";
// import axios from "axios";

// const FranchiseChart = () => {
//   const chartRef = useRef(null);
//   const [franchiseData, setFranchiseData] = useState({
//     states: [],
//     franchisesByType: {},
//     totalFranchises: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("https://franchiseapi.kictindia.com/franchise/all");
//         setFranchiseData(formatDataForChart(response.data));
//       } catch (err) {
//         setError("Failed to fetch data");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const formatDataForChart = (data) => {
//     const formattedData = data.reduce(
//       (acc, franchise) => {
//         const state = franchise.State;
//         const type = franchise.Type || "Other"; // Franchise type (optional, default to 'Other')
//         const name = franchise.Name;

//         if (!acc.states.includes(state)) {
//           acc.states.push(state);
//         }
//         if (!acc.franchisesByType[type]) {
//           acc.franchisesByType[type] = [];
//         }
//         if (!acc.franchisesByType[type][state]) {
//           acc.franchisesByType[type][state] = [];
//         }
//         acc.franchisesByType[type][state].push(name);

//         return acc;
//       },
//       {
//         states: [],
//         franchisesByType: {},
//       }
//     );

//     const totalFranchises = formattedData.states.map((state) => {
//       return Object.keys(formattedData.franchisesByType).reduce((sum, type) => {
//         return sum + (formattedData.franchisesByType[type][state]?.length || 0);
//       }, 0);
//     });

//     return { ...formattedData, totalFranchises };
//   };

//   useEffect(() => {
//     if (!chartRef.current || loading || error || !franchiseData.states.length)
//       return;

//     const chart = echarts.init(chartRef.current);

//     const seriesData = Object.keys(franchiseData.franchisesByType).map(
//       (type) => ({
//         name: type,
//         type: "bar",
//         stack: "total", // Stack bars by type
//         emphasis: {
//           focus: "series",
//         },
//         data: franchiseData.states.map(
//           (state) => franchiseData.franchisesByType[type][state]?.length || 0
//         ),
//       })
//     );

//     const options = {
//       title: {
//         text: "Franchise Distribution by State and Type",
//         left: "center",
//       },
//       tooltip: {
//         trigger: "axis",
//         axisPointer: {
//           type: "shadow",
//         },
//         formatter: (params) => {
//           let tooltip = `${params[0].name}<br/>`;
//           params.forEach((item) => {
//             tooltip += `${item.marker} ${item.seriesName}: ${item.value}<br/>`;
//           });
//           return tooltip;
//         },
//       },
//       legend: {
//         top: "10%",
//         data: Object.keys(franchiseData.franchisesByType),
//       },
//       grid: {
//         left: "3%",
//         right: "4%",
//         bottom: "3%",
//         containLabel: true,
//       },
//       xAxis: {
//         type: "category",
//         data: franchiseData.states,
//         axisLabel: {
//           rotate: 30,
//           fontSize: 12,
//         },
//       },
//       yAxis: {
//         type: "value",
//         name: "Number of Franchises",
//       },
//       series: seriesData,
//       animationDurationUpdate: 1000,
//     };

//     chart.setOption(options);

//     const handleResize = () => {
//       chart.resize();
//     };
//     window.addEventListener("resize", handleResize);

//     return () => {
//       chart.dispose();
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [franchiseData, loading, error]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div
//       ref={chartRef}
//       style={{
//         width: "100%",
//         height: "70vh",
//         minWidth: "320px",
//       }}
//     />
//   );
// };

// export default FranchiseChart;

// import React, { useEffect, useRef } from "react";
// import * as echarts from "echarts";
// import indiaMap from "../../../../geojson/india.json"; // Path to your India GeoJSON file

// const FranchiseChart = ({ data = [] }) => { // Default to empty array
//   const chartRef = useRef(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     // Ensure `data` is an array and valid
//     if (!Array.isArray(data) || data.length === 0) {
//       console.error("Invalid data received, expecting an array of franchises.");
//       return;
//     }

//     // Register the India map
//     echarts.registerMap("india", indiaMap);

//     // Transform the data
//     const groupedData = data.reduce((acc, franchise) => {
//       if (!franchise.State || !franchise.City) {
//         return acc; // Skip invalid franchise data
//       }

//       // Initialize state and city data if not already present
//       if (!acc[franchise.State]) {
//         acc[franchise.State] = {};
//       }
//       if (!acc[franchise.State][franchise.City]) {
//         acc[franchise.State][franchise.City] = 0;
//       }
//       acc[franchise.State][franchise.City] += 1; // Count franchises per city
//       return acc;
//     }, {});

//     // Create state data for the map
//     const stateData = Object.keys(groupedData).map((state) => ({
//       name: state,
//       value: Object.values(groupedData[state]).reduce((a, b) => a + b, 0), // Total franchises per state
//     }));

//     // Initialize the chart
//     const chart = echarts.init(chartRef.current);

//     // Initial Map Option
//     const mapOption = {
//       title: {
//         text: "Franchise Distribution by State (India)",
//         left: "center",
//       },
//       tooltip: {
//         trigger: "item",
//       },
//       visualMap: {
//         min: 0,
//         max: Math.max(...stateData.map((s) => s.value)),
//         left: "left",
//         top: "bottom",
//         text: ["High", "Low"],
//         calculable: true,
//       },
//       series: [
//         {
//           type: "map",
//           map: "india", // Use the India map
//           roam: true,
//           data: stateData,
//         },
//       ],
//     };

//     // Update the chart with the initial map
//     chart.setOption(mapOption);

//     // Morphing logic for Bar Chart
//     chart.on("click", function (params) {
//       const state = params.name;
//       if (groupedData[state]) {
//         const cityData = Object.keys(groupedData[state]).map((city) => ({
//           name: city,
//           value: groupedData[state][city],
//         }));

//         // Bar Chart Option
//         const barOption = {
//           title: {
//             text: `Franchises in ${state}`,
//             left: "center",
//           },
//           tooltip: {
//             trigger: "axis",
//             axisPointer: {
//               type: "shadow",
//             },
//           },
//           xAxis: {
//             type: "category",
//             data: cityData.map((c) => c.name),
//           },
//           yAxis: {
//             type: "value",
//           },
//           series: [
//             {
//               type: "bar",
//               data: cityData.map((c) => c.value),
//             },
//           ],
//         };

//         chart.setOption(barOption);
//       }
//     });

//     // Cleanup on component unmount
//     return () => {
//       chart.dispose();
//     };
//   }, [data]);

//   return <div ref={chartRef} style={{ width: "100%", height: "500px" }} />;
// };

// export default FranchiseChart;
