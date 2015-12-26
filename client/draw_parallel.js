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
  height        = 1240;
  width         = 940;
  color         = d3.scale.category20c();
  colorByPath   = {};
  boxSide       = 310;
  routeKeys     = Object.keys(Routes);
  currentYpos   = 0;
  linkScale     = d3.scale.linear().domain([0,70000]).range([3,50]);
  lowVolume     = 1;
  linkGutter    = 0;

 flowIds.forEach(
 function(el,i) {
   colorByPath[el] = color(i)
 })

  var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

  svg.append("defs").append("pattern")
        .attr("id", "org_diag")
        .attr("width", 8)
        .attr("height", 8)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("patternTransform", "rotate(45)")
      .append("rect")
        .attr("width", 4)
        .attr("height", 8)
        .attr("transform", "translate(0,0)")
        .attr("fill", "orange")
        

  var groups = svg.selectAll("g").data(Routes).enter().append("g")
        .attr("transform", function(d,i) {
        return "translate("+(boxSide*(i%3))+","
                           + (boxSide*Math.floor(i/3)+5)
                           + ")"
        })
        
  // draw links
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
        //console.log(data[d]) 
        return 10})
        .attr("y", function(d,i) {
        if (data[d]){
          if (currentYpos === 0) {
            data[d]["dy"] = 0
            currentYpos += linkScale(data[d].segments[0]["Product volume"])
            return 0
          }
          else {
            currentYpos += linkScale(data[d].segments[0]["Product volume"])+linkGutter
            data[d]["dy"] = currentYpos - linkScale(data[d].segments[0]["Product volume"])
            return currentYpos - linkScale(data[d].segments[0]["Product volume"])
          }
        }
        })
        .attr("height", function(d,i) {
        if (data[d]){
          return linkScale(data[d].segments[0]["Product volume"])
        }
        })
        .attr("width", 300)
        .attr("stroke-width", 1)
        .attr("stroke", "#fff")
        .attr("fill", function(d,i) {
        if (data[d]){
          console.log("fill data", d)
          var clr = colorByPath[d]
          var seg = data[d].segments[0]
          return seg["Product volume"] < lowVolume ? "url(#org_diag)" : clr ? clr : "#eeeeef"
        }
        }).on("mouseenter", function(d){
           console.log(data[d])
           //svg.append("rect")
           //   .attr("x", 310)
           //   .attr("y", data[d].dy)
           //   .attr("width", 20)
           //   .attr("height", this.getAttribute("height"))
           //   .attr("fill", "orange")
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

