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
      currentYpos, lowVolume, color;

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
  
  height        = 1540;
  width         = 1500;
  color         = d3.scale.category20();
  colorByPath   = {};
  boxSide       = 410;
  routeKeys     = Object.keys(Routes);
  currentYpos   = 0;
  linkScale     = d3.scale.linear().domain([0,93000]).range([2,28]);
  lowVolume     = 1;
  linkGutter    = 10;

  colorByPath["558"]= color(1)
  colorByPath["561"]= color(2)
  colorByPath["594"]= color(3)
  colorByPath["597"]= color(4)
  colorByPath["600"]= color(5)
  colorByPath["606"]= color(6)
  colorByPath["615"]= color(7)
  colorByPath["618"]= color(8)
  colorByPath["662"]= color(9)
  colorByPath["695"]= color(10)

  var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

  var groups = svg.selectAll("g").data(Routes).enter().append("g")
        .attr("transform", function(d,i) {
        return "translate("+(boxSide*(i%3))+","
                           + boxSide*Math.floor(i/3)
                           + ")"
        })
        
  // draw links
  groups.each(
  function(data,index){ 
  d3.select(this).selectAll("rect")
        .data(function(d,i) {
        currentYpos = 0;
        return Object.keys(d)
        })
       .enter()
        .append("rect")
        .attr("fill", "#bbb")
        .attr("x", function(d,i) {
        //console.log(data[d]) 
        return 10})
        .attr("y", function(d,i) {
          if (currentYpos === 0) {
            data[d]["dy"] = 0
            currentYpos += linkScale(data[d].segments[0]["Product volume"])
            return 0
          }
          else {
            currentYpos += linkScale(data[d].segments[0]["Product volume"])+linkGutter
            data[d]["dy"] = currentYpos - linkScale(data[d].segments[0]["Product volume"])
            return i*32
            return currentYpos - linkScale(data[d].segments[0]["Product volume"])
          }
        })
        .attr("height", function(d,i) {
            return linkScale(data[d].segments[0]["Product volume"])
        })
        .attr("width", 300)
        .attr("fill", function(d,i) {
        console.log("fill data", d)
        var clr = colorByPath[d]
        var seg = data[d].segments[0]
        return seg["Product volume"] < lowVolume ? "red" : clr ? clr : "#eeeeef"
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

