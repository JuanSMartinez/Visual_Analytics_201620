(function(){
    
    //SVG
    var width =800;
    var height = 500;
    var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
    
    //Time scales for control 
    var scaleMinutes = d3.scaleLinear().range([10, width-100]);
    var scaleDays = d3.scaleLinear().range([0, width]);
    var scaleMonths = d3.scaleLinear().range([0, width]);
    var scaleYears = d3.scaleLinear().range([0, width]);
    
    function update(data){
        
        scaleMinutes.domain(d3.extent(data, function(d){return d["Minuto"];}));
        //scaleMinutes.domain([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + (height - 100)+ ")")
            .call(d3.axisBottom(scaleMinutes));
        
        
    };
    
    d3.json("json/buses.json", function(error, data){
       if(error){
           throw error;
       }
       update(data)  
    });
    
    
})();