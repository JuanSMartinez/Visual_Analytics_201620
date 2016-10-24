(function(){
    
    //Filter values
    var year, month, day;
    
    //SVG
    var width =800;
    var height = 500;
    var margin = {top: 20, left: 20, right: 20, bottom: 20};
    var effWidth = width - margin.left - margin.right;
    var effHeight = height - margin.top - margin.bottom;
    var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
    
    //Time scales for control 
    var scaleMinutes = d3.scaleLinear().range([0, effWidth]);
    var scaleDays = d3.scaleLinear().range([0, width]);
    var scaleMonths = d3.scaleLinear().range([0, width]);
    var scaleYears = d3.scaleLinear().range([0, width]);
    
    //Horizon chart for velocity
    function horizonChartVel(data){
        //Filter by date
        /*
        var filteredDate = data.map(function(d){
            if (d["Anio"] == year && d["Mes"] == month && d["Dia"] == day)
                return d;
        });
        
        //Average velocities through hours
        var filteredHours = filteredDate.map(function(d){
            
        });*/
        
        // generate some random data
        var series = [];
        for (var i = 0, variance = 0, value; i < 1500; i++) {
            variance += (Math.random() - 0.5) / 10;
            series.push(Math.abs(Math.cos(i/100) + variance)); // only positive values
        }
        var horizonChart = d3.horizonChart();
        // 4-band horizon (4 negative & 4 positive bands)
        var colors = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#fee090', '#fdae61', '#f46d43', '#d73027'];
        var n = colors.length / 2;
        
        var horizons = d3.select('#chart').selectAll('.horizon')
            .data(d3.range(0, n).map(function() {return series;}))
            .enter().append('div')
            .attr('class', 'horizon')
            .each(function(d, i) {
                
                var j = i+1;
                horizonChart.colors(colors.slice(n-j, n+j))
                    .height(120/j)
                    .title('Horizon, ' + j + '-band (' + 120/j + 'px)')
                    .call(this, d);
                
            });
        
        
    }
    
    //Horizontal slider
    function hSlider(array, width){
        
        //Remove duplicates
        var newArray = [];
        array.forEach(function(d){
            var index = newArray.indexOf(d)
            if(index < 0 )
                newArray.push(d);
        });
        
        var delta = width/(array.length-1);
        var linearRange = d3.range(0, width+1, delta);
        var container = svg.append("g").attr("transform", "translate(" + effWidth/2 + "," + effHeight/2  +")");
       
        var line = container.append('line')
        .attr('x1', -width/2)
        .attr('y1', effHeight/2 )
        .attr('x2', width/2)
        .attr('y2', effHeight/2)
        .style("stroke-width", 2)
        .style("stroke", "black")
        .style("fill", "none");
        var drag = d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
        
        handle = [{
          x: 0,
          y: effHeight/2
        }];
        
        handle_circle = container.append("g")
          .attr("class", "dot")
            .selectAll('circle')
          .data(handle)
            .enter().append("circle")
          .attr("r", 5)
          .attr("cx", function(d) { return d.x;})
          .attr("cy", function(d) { return d.y;})
          .call(drag);
        
        var lines = container.append("g")
                .selectAll('lines')
                .data(linearRange).enter().append("line")
                .attr("x1", function(d) { return d-width/2; })
                .attr("y1", function(d) { return effHeight/2-5; })
                .attr("x2", function(d) { return d-width/2; })
                .attr("y2", function(d) { return effHeight/2+5; })
                .style("stroke-width", 1)
                .style("stroke", "black")
                .style("fill", "none");
        
       var txt = container.append("g")
                .selectAll('labels')
                .data(linearRange).enter().append("text")
                .attr("style","text-anchor: middle")
                .attr("x", function(d) { return d-width/2; })
                .attr("y", effHeight/2-10)
                .text( function (d) { return newArray[linearRange.indexOf(d)]; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");
                //.attr("transform", function(d){return rotate(d);});
        
        
        function closestTag(x){
            
            var closest;
            var distance;
            linearRange.forEach(function(xc){
                
                if(distance == undefined || Math.abs(xc-x) < distance){
                    distance = Math.abs(xc-x);
                    closest = newArray[linearRange.indexOf(xc)];
                }
            });
            return closest;
        }
        
        function dragstarted(d) {
          d3.event.sourceEvent.stopPropagation();
          d3.select(this)
            .classed("dragging", true);
        }

        function dragged(d) { 
            var pos;
            if (d3.event.x > width/2)
                pos = width/2;
            else if(d3.event.x < -width/2)
                pos = -width/2;
            else
                pos = d3.event.x;

            year = closestTag(pos + width/2);
            
            d3.select(this)
            .attr("cx", d.x = pos);
        }

        function dragended(d) {
          d3.select(this)
            .classed("dragging", false);
            
        }
    }
    
    //Round sliders
    function slider(circumference_r, array, type){
        
        //Remove duplicates
        var newArray = [];
        array.forEach(function(d){
            var index = newArray.indexOf(d)
            if(index < 0 )
                newArray.push(d);
        });
        
        var delta = 2*Math.PI/(newArray.length);
        var angularRange = d3.range(0, 2*Math.PI, delta);
        
        var drag = d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
    
        var container = svg.append("g").attr("transform", "translate(" + effWidth/2 + "," + effHeight/2 + ")");;
        var circumference = container.append('circle')
        .attr('r', circumference_r)
        .attr('class', 'slider');

        handle = [{
          x: 0,
          y: -circumference_r
        }];

        handle_circle = container.append("g")
          .attr("class", "dot")
            .selectAll('circle')
          .data(handle)
            .enter().append("circle")
          .attr("r", 5)
          .attr("cx", function(d) { return d.x;})
          .attr("cy", function(d) { return d.y;})
          .call(drag);
        
        var txt = container.append("g")
                .selectAll('labels')
                .data(angularRange).enter().append("text")
                .attr("style", function(d){return anchor(d);})
                .attr("x", function(d) { return getX(d); })
                .attr("y", function(d) { return getY(d); })
                .text( function (d) { return newArray[angularRange.indexOf(d)]; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black")
                .attr("transform", function(d){return rotate(d);});
        
        var line = container.append("g")
                .selectAll('lines')
                .data(angularRange).enter().append("line")
                .attr("x1", function(d) { return getX1(d); })
                .attr("y1", function(d) { return getY1(d); })
                .attr("x2", function(d) { return getX2(d); })
                .attr("y2", function(d) { return getY2(d); })
                .style("stroke-width", 1)
                .style("stroke", "black")
                .style("fill", "none");
        
        function anchor(alpha){
            var cos = Math.round(Math.cos(alpha) * 1000) / 1000;
            if(Math.sign(cos) >= 0)
                return "text-anchor: start";
            else if(Math.sign(cos) < 0)
                return "text-anchor: end";
        }
        
        function rotate(alpha){
            var cos = Math.round(Math.cos(alpha) * 1000) / 1000;
            var sgncos = Math.sign(cos);
            var angle = sgncos >= 0 ? alpha*180/Math.PI : sgncos*(180 - alpha*180/Math.PI);
            return "rotate(" + angle +","+getX(alpha)+","+getY(alpha)+")";
        }
        
        function getX1(alpha){
            var cos = Math.cos(alpha);
            return (circumference_r-5)*cos
        }
        
        function getY1(alpha){
            var sin = Math.sin(alpha);
            return (circumference_r-5)*sin
        }
        
        function getX2(alpha){
            var cos = Math.cos(alpha);
            return (circumference_r+5)*cos;
        }
        
        function getY2(alpha){
            var sin = Math.sin(alpha);
            return (circumference_r+5)*sin
        }
        
        function getX(alpha){
            var cos = Math.cos(alpha - (5/circumference_r)*Math.PI/180);
            return (circumference_r+5)*cos
        }
        
        function getY(alpha){
            var sin = Math.sin(alpha - (10/circumference_r)*Math.PI/180);
            return (circumference_r+10)*sin
        }
        
        function closestTag(alpha){
            var closest;
            var distance;
            angularRange.forEach(function(angle){
                if(distance == undefined || Math.abs(alpha-angle) < distance){
                    distance = Math.abs(alpha-angle);
                    closest = newArray[angularRange.indexOf(angle)];
                }
            });
            return closest;
        }

        function dragstarted(d) {
          d3.event.sourceEvent.stopPropagation();
          d3.select(this)
            .classed("dragging", true);
        }

        function dragged(d) {  
            d_from_origin = Math.sqrt(Math.pow(d3.event.x,2)+Math.pow(d3.event.y,2));
            alpha = Math.acos(d3.event.x/d_from_origin);
            var angle;
            var x = d3.event.x;
            var y = d3.event.y;
            if(y < 0){
                angle = 2*Math.PI - alpha;
            }
            else{
                angle = alpha;    
            }
            if(type=="month"){
                month = newArray.indexOf(closestTag(angle)) + 1;
              
            }
            else if(type=="day"){
                day = closestTag(angle);
                
            }
            d3.select(this)
            .attr("cx", d.x = circumference_r*Math.cos(alpha))
            .attr("cy", d.y = d3.event.y < 0 ? -circumference_r*Math.sin(alpha) : circumference_r*Math.sin(alpha));
        }

        function dragended(d) {
          d3.select(this)
            .classed("dragging", false);
            
        }
    }
    
    //Generate average velocities for every bus line throughout a day and a month
    
    function update(data){
        var radius = [100, 50];
        var monthRange = ["Enero", "Febrero", "Marzo", "Abril", "Mayo",
                            "Junio", "Julio", "Agosto", "Septiembre", 
                         "Octubre", "Noviembre", "Diciembre"];
        var dayRange = d3.range(1,32,1);
        var yearRange = [2010,2011,2012,2013,2014,2015,2016];
        var vel = data.map(function(d){return {"Id": data["Linea"],"Velocidad":data["Velocidad"]};});
        
        hSlider(yearRange, 400);
        slider(100, monthRange, "month");
        slider(60, dayRange, "day");
        horizonChartVel(data);
    };
    
    d3.json("json/buses.json", function(error, data){
       if(error){
           throw error;
       }
       update(data) 
       
    });
    
    
})();