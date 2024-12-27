// Set dimensions
const margin = { top: 50, right: 30, bottom: 100, left: 110 }, // Ruang lebih untuk label Y
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// Append SVG with white background
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color", "white") // Warna putih
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load data
d3.csv("data.csv").then(data => {
    data.forEach(d => {
        d.Year = +d.Year; // Convert Year to number
        d.Population = +d.Population.replace(/\./g, '').replace(/ /g, ''); // Remove dots and spaces, then convert to number
    });

    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);
    const y = d3.scaleLinear()
        .domain([1000000, d3.max(data, d => d.Population)]) // Mulai dari 1 juta
        .range([height, 0]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(data.length).tickFormat(d3.format("d")))
        .selectAll("text")
        .style("font-size", "12px");

    svg.append("g")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d => d.toLocaleString("id-ID")))
        .selectAll("text")
        .style("font-size", "14px");

    // Add X axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 50) // Jarak dari sumbu X
        .style("font-size", "14px")
        .text("Tahun");

    // Add Y axis label
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(-70,${height / 2}) rotate(-90)`) // Rotasi untuk sumbu Y, geser lebih ke kiri
        .style("font-size", "14px")
        .text("Populasi");

    // Line generator
    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Population));

    // Path with animation
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 2)
        .attr("d", line)
        .attr("stroke-dasharray", function () {
            return this.getTotalLength();
        })
        .attr("stroke-dashoffset", function () {
            return this.getTotalLength();
        })
        .transition()
        .duration(2000) // Durasi animasi (2 detik)
        .attr("stroke-dashoffset", 0);

    // Circles
    svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.Year))
        .attr("cy", d => y(d.Population))
        .attr("r", 5)
        .attr("fill", "#69b3a2")
        .style("opacity", 0) // Awalnya transparan
        .transition()
        .duration(2000) // Sama dengan durasi animasi garis
        .delay((d, i) => i * 200) // Delay per titik
        .style("opacity", 1);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll("circle")
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1)
                .html(`Year: ${d.Year}<br>Population: ${d.Population.toLocaleString("id-ID")}`) // Format angka dengan koma
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => tooltip.style("opacity", 0));
});

// Add description below chart
d3.select("#chart")
    .append("p")
    .style("text-align", "center")
    .style("font-size", "14px")
    .style("font-family", "Arial, sans-serif")
    .style("margin-top", "20px")
    .text(`Diagram menunjukkan perkembangan populasi warga Kota Bandung setiap lima tahun dari tahun 2000 hingga 2020. 
Pada tahun 2000, jumlah penduduk tercatat sebesar 2.136.260 jiwa, dan terus mengalami peningkatan setiap lima tahun berikutnya. 
Pada tahun 2005, populasi bertambah menjadi 2.254.250 jiwa, yang berarti terdapat peningkatan sekitar 117.990 jiwa dibandingkan lima tahun sebelumnya. 
Selanjutnya, pada tahun 2010, jumlah penduduk meningkat signifikan menjadi 2.394.873 jiwa, menunjukkan pertumbuhan sebesar 140.623 jiwa dalam periode lima tahun tersebut. 
Peningkatan populasi terus terjadi hingga tahun 2015 dengan angka mencapai 2.481.469 jiwa, meskipun pertumbuhan dalam periode ini lebih kecil dibandingkan sebelumnya, yaitu sebesar 86.596 jiwa. 
Pada tahun 2020, populasi mencapai 2.510.103 jiwa, dengan pertambahan hanya 28.634 jiwa dalam lima tahun terakhir.

Dari diagram ini, terlihat bahwa meskipun populasi Kota Bandung terus bertambah, laju pertumbuhan populasi mengalami penurunan dalam beberapa periode terakhir. 
Penurunan ini dapat mengindikasikan berbagai faktor, seperti migrasi, penurunan angka kelahiran, atau peningkatan kesadaran akan pengendalian populasi. 
Secara keseluruhan, populasi Kota Bandung meningkat sebesar 373.843 jiwa dalam dua dekade terakhir. 
Hal ini menunjukkan bahwa Kota Bandung tetap menjadi salah satu wilayah dengan daya tarik tinggi sebagai tempat tinggal, baik karena faktor ekonomi maupun infrastruktur. 
Namun, dengan pertumbuhan yang semakin melambat, pemerintah kota dapat menggunakan data ini untuk mempersiapkan kebijakan yang mendukung stabilitas sosial, ekonomi, dan infrastruktur untuk masa depan.`);
