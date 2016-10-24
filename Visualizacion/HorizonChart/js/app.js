(function(){
    
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
    
    //Vertical slider
    function vSlider(array, width){
        //Remove duplicates
        var newArray = [];
        array.forEach(function(d){
            var index = newArray.indexOf(d)
            if(index < 0 )
                newArray.push(d);
        });
        
        var delta = width/(array.length-1);
        var linearRange = d3.range(0, width+1, delta);
        console.log(linearRange);
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
          d3.select(this)
            .attr("cx", d.x = pos);
        }

        function dragended(d) {
          d3.select(this)
            .classed("dragging", false);
            
        }
    }
    
    //Round sliders
    function slider(circumference_r, array){
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

        function dragstarted(d) {
          d3.event.sourceEvent.stopPropagation();
          d3.select(this)
            .classed("dragging", true);
        }

        function dragged(d) {  
          d_from_origin = Math.sqrt(Math.pow(d3.event.x,2)+Math.pow(d3.event.y,2));

          alpha = Math.acos(d3.event.x/d_from_origin);

          d3.select(this)
            .attr("cx", d.x = circumference_r*Math.cos(alpha))
            .attr("cy", d.y = d3.event.y < 0 ? -circumference_r*Math.sin(alpha) : circumference_r*Math.sin(alpha));
        }

        function dragended(d) {
          d3.select(this)
            .classed("dragging", false);
            
        }
    }
    

    
    function update(data){
        var radius = [100, 50];
        //var monthRange = d3.range(1,13,1);
        var monthRange = ["Enero", "Febrero", "Marzo", "Abril", "Mayo",
                            "Junio", "Julio", "Agosto", "Septiembre", 
                         "Octubre", "Noviembre", "Diciembre"];
        var dayRange = d3.range(1,32,1);
        var yearRange = [2010,2011,2012,2013,2014,2015,2016];
        slider(100, monthRange);
        slider(60, dayRange);
        vSlider(yearRange, 400);
       
     
    };
    
    d3.json("json/buses.json", function(error, data){
       if(error){
           throw error;
       }
       update(data) 
       
    });
    
    
})();