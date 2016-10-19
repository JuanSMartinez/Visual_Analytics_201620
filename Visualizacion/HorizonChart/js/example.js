

// seeded-random.js ////////////////////////////////
// A seeded random number generators adapted from:
// http://stackoverflow.com/questions/521295/javascript-random-seeds
function seededRandom(s) {
    var m_w  = 987654321 + s;
    var m_z  = 987654321 - s;
    var mask = 0xffffffff;

    return function() {
      m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

      var result = ((m_z << 16) + m_w) & mask;
      result /= 4294967296;

      return result + 0.5;
    }
}
// END seeded-random.js ////////////////////////////////


var seed = 1, t = 0;
function random() {
    var rand = seededRandom(seed);
    var data = [];
    for(var i = -t, variance = 0; i < 1000; i++) {
        variance += (rand() - 0.5) / 10;
        // Pre-roll the random number generator's results to match where they should be at this `t`.
        if(i > 0) {
            data.push([i, Math.cos((i+t)/100) + variance]);
        }
    }
    return data;
}

var width = 960;
var height = 40;
var updateDelay = 50;

var chart = d3.horizon()
    .width(width)
    .height(height)
    .bands(4)
    .mode("offset")
    .curve(d3.curveMonotoneX)
    //.curve(d3.curveStep)
    .colors(["#ff7e71", "#891d00", "#005227", "#00bd62"]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Render the chart.
var data = random();
svg.data([random()]).call(chart);

d3.select("#horizon-bands-value").text(chart.bands());

var timingElem = document.getElementById('timing');
function toPrecision(num, precision) {
    num = num.toString().split('.');
    return num[0] + '.' + ((num[1] || '') + '0000000000').slice(0, precision);
}
function time(cb) {
    var startTime = performance.now();
    var ret = cb();
    var endTime = performance.now();
    var timingMessage = `Update took ${toPrecision(endTime - startTime, 3)} ms.`;
    //console.log(timingMessage);
    timingElem.innerHTML = timingMessage;
    return ret;
}

// Re-render with shifted data every 1/10th of a second,
// and re-render with completely new data every 2 seconds.
function doUpdate() {
    t += 1;
    if(t >= 100) {
        t = -5;
        seed++;
        svg.data([random()]).call(chart.duration(240));
    } else if(t >= 0) {
        var randomData = random();
        time(() => svg.data([randomData]).call(chart.duration(0)));
    }
    setTimeout(doUpdate, updateDelay);
}
doUpdate();

// Enable mode buttons.
d3.selectAll("#horizon-controls input[name=mode]")
    .on("change", function() {
        svg.call(chart.duration(0).mode(this.value));
    });

// Enable bands buttons.
d3.selectAll("#horizon-bands button").data([-1, 1])
    .on("click", (d) => {
        var n = Math.max(1, chart.bands() + d);
        d3.select("#horizon-bands-value").text(n);
        svg.call(chart.duration(1000).bands(n));
    });

