Template.body.onRendered(
function() {
  var div = document.createElement("div");
  div.innerHTML = "Order " + FlowRouter.getParam("order_number") /*+
                  " Route " + FlowRouter.getParam("route_number")*/
  document.body.appendChild(div);
  var instance = this;

instance.autorun(
function(){
   
  if (FlowRouter.getParam("order_number")) {
  var order = FlowRouter.getParam("order_number")
  }

  if (order === "11") {
  var data = Periods.findOne();
  }

  if (instance.subscriptionsReady()) {

  var Routes, height, width, boxSide, linkScale, linkGutter,
      currentYpos, lowVolume, color, flowIds;

  Routes = [];
  
  Object.keys(data).forEach(
  function(el) {
    if (el !== "_id") {
      var d = data[el].ord11
      var ob = ParseUtils.processRoutes(d);
      ob["Period"] = el;
      Routes.push(ob)
    }
  })
  
  Routes.sort(function(a,b) { 
  var a = parseInt(a["Period"].replace('p', ''))
  var b = parseInt(b["Period"].replace('p', ''))
  if (a < b)
    return -1
  else
    return 1
  })

  Routes.map(function(el) {
   delete(el.Period);
  })

  console.log(Routes)
  
  flowIds       = ['555', '557', '558', '560', '561', '563', '594', '595', '596', '597', '598', '599', '600', '601', '602', '606', '615', '618', '662', '695', '697']
  height        = 400;
  width         = 1200;
  color         = d3.scale.category20();
  colorByPath   = {};
  boxSide       = 75;
  routeKeys     = Object.keys(Routes);
  currentYpos   = 0;
  linkScale     = d3.scale.linear().domain([0,93000]).range([3,50]);
  lowVolume     = 1;
  linkGutter    = 0;

 for (var i=0; i < 3; i++) {
   color(i)
 }


 flowIds.forEach(
 function(el,i) {
   colorByPath[el] = color(i+3)
 })

  var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

  var groups = svg.selectAll("g").data(Routes).enter().append("g")
        .attr("transform", function(d,i) {
        return "translate("+ (boxSide*(i%12))+","
                           + (boxSide*Math.floor(i/12)+5)
                           + ")"
        })
        
  // add rects for flows
  groups.each(
  function(data,index){ 
  d3.select(this).selectAll("rect")
        .data(function(d,i) {
        currentYpos = 0;
        return flowIds
        return Object.keys(d)
        })
       .enter()
        .append("rect")
        .attr("x", function(d,i) {
        return 10})
        .attr("y", function(d,i) {
        if (data[d]){
          if (currentYpos === 0 && data[d].segments[0]["Product volume"] > 1) {
            data[d]["dy"] = 0
            currentYpos += linkScale(data[d].segments[0]["Product volume"])
            return 0
          }
          else if (data[d].segments[0]["Product volume"] > 1) {
            currentYpos += linkScale(data[d].segments[0]["Product volume"])+linkGutter
            data[d]["dy"] = currentYpos - linkScale(data[d].segments[0]["Product volume"])
            return currentYpos - linkScale(data[d].segments[0]["Product volume"])
          }
        }
        })
        .attr("height", function(d,i) {
        if (data[d] && data[d].segments[0]["Product volume"] > 1){
          return linkScale(data[d].segments[0]["Product volume"])
        }
        })
        .attr("width", 70)
        .attr("stroke-width", 1)
        .attr("stroke", "#fff")
        .attr("fill", function(d,i) {
        if (data[d] && data[d].segments[0]["Product volume"] > 1){
          var clr = colorByPath[d]
          var seg = data[d].segments[0]
          return seg["Product volume"] < lowVolume ? "url(#org_diag)" : clr ? clr : "#eeeeef"
        }
        }).on("mouseenter", function(d){
           console.log(data[d])
           })
  })

  // add the circles for low volume
  groups.each(
  function(data,index) {
    var currentYposLow = 100;
    var xIndex1 = 0;
    var xIndex2 = 0;
  d3.select(this).selectAll("low")
        .data(function(d,i) {
        return flowIds
        })
       .enter()
        .append("circle")
        .attr("class", "low")
        .attr("cx", function(d,i) {
        if (data[d]){
          if (data[d].segments[0]["Product volume"] < 1) {
            xIndex1+=1
            return 10*((xIndex1-1)%7)+15
          }
        }
        return 10})
        .attr("cy", function(d,i) {
        if (data[d]){
          if (data[d].segments[0]["Product volume"] < 1) {
            xIndex2 += 1
            return currentYposLow+10*Math.floor((xIndex2-1)/7)
            currentYposLow += linkScale(data[d].segments[0]["Product volume"])+3
            return currentYposLow - linkScale(data[d].segments[0]["Product volume"])
          }
        }
        })
        .attr("r", function(d,i) {
        if (data[d] && data[d].segments[0]["Product volume"] < 1){
          return 4
          return linkScale(data[d].segments[0]["Product volume"])
         }
        })
        .attr("stroke-width", 1)
        .attr("stroke", "none")
        .attr("fill", function(d,i) {
        if (data[d] && data[d].segments[0]["Product volume"] < 1){
          return "orange"
          var clr = colorByPath[d]
          var seg = data[d].segments[0]
          return seg["Product volume"] < lowVolume ? "url(#org_diag)" : clr ? clr : "#eeeeef"
        }
        }).on("mouseenter", function(d){
           console.log(data[d])
           })
  })

  // label paths
  //groups.append("text")
  //      .attr("x", 125)
  //      .attr("dy", ".35em")
  //      .attr("text-anchor", "start")
  //      .attr("y",    function(d,i) {
  //      return Routes[i][d].dy + linkScale(Routes[i][d].segments[0]["Product volume"])/2
  //      })
  //      .text(function(d,i) {
  //      return Routes[i][d].path.join(" ")  
  //      })

  //svg.on("mousemove", function() {
  //  groups.attr("opacity", function(d,i) {console.log(Routes[i][d])}) 
  //})

  } // subs ready 

  }) // autorun
}) // onRendered

