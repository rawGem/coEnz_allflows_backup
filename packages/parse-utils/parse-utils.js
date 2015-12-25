ParseUtils = {};
ParseUtils.TAGS = {};


ParseUtils._parseSegments = function(seg) {
  var segments = seg.split("-");
  if (segments.length > 1) {
    segments.forEach(function(el, i, a) { 
      segments[i] = el.trim()
    })
  }
  return segments;
};


ParseUtils._getSegmentTag = function(seg) {
  return seg.split(" ")[0]
}


ParseUtils._compareBySegmentRank = function(a,b) {
   if (a["Segment rank"] < b["Segment rank"]) 
     return -1;
   else 
     return 1;
}


ParseUtils._cleanLoadUnloadRoutes = function(segments) {
  /* [<-]: array of sorted segments */ 
   
  /* check if it's a load segment */
  if (segments[0]["Origin"].split(" ")[0] === "Load"){ 
    var cln_segments = segments.slice();
    var collapse = cln_segments.slice(0,3);
    var reorder = cln_segments.slice(3);

    var node1 = collapse[0]["Segment name"].split(" ")[1]
    var node2 = collapse[2]["Segment name"].split(" ")[1]
    collapse = collapse[1];
    collapse["Segment rank"] = 1;
    collapse["Segment name"] = node1+" - "+node2

    reorder.forEach(
    function(el) {
      el["Segment rank"] -= 2
    })
    return [collapse].concat(reorder)
  }

  if (segments[0]["Origin"].split(" ")[0] === "Unload") {
    console.error("clean Unload::NotImplemented", segments[0])
  }

  return segments
}

ParseUtils._assignPath = function(route) {
  route.segments.forEach(
  function(el,i) {
    if (i === route.segments.length -1){
      var seg = el["Segment name"].split("-")[0];
      var end = el["Segment name"].split("-")[1].trim();
      end = end.split(" ")[0];
      route.path.push(seg.trim());
      route.path.push(end);
    } 
    else {
      var seg = el["Segment name"].split("-")[0];
      route.path.push(seg.trim());
    }
  })
}


ParseUtils._subrouteNodeNames = function(segments) {
  /* [<-] array of subroutes sorted by 'Segment rank' 
   * [->] {RU: "RU", EV: "EV 24", CU: "CU 24"}   
   */
  var tags = {},
      self = this;

  segments.forEach(
  function(el, i, a) {
    var segs = self._parseSegments(el["Segment name"])
    if (i === 0)
      tags[segs[0]] = segs[0]

    if (segs.length === 2) {
    segs.forEach(
    function(el) {
      if (el.split(" ").length > 1 && 
          Object.keys(tags).indexOf(el.split(" ")[0]) === -1) 
        tags[el.split(" ")[0]] = el
    })
    }

    /* to handle 'tag - tag - tag'*/
    if (segs.length === 3) {
      if (Object.keys(tags).indexOf(segs[segs.length-1]) === -1)
        tags[segs[segs.length-1]] = segs[segs.length-1]
    }

  })
  
  return tags
}


ParseUtils.setAllTags = function(sorted_segments_obj) {
  /*[<-] obj returned from processRoutes */
  var self = this,
      index = 0;

  var routes = Object.keys(sorted_segments_obj)

  routes.forEach(
  function(el) {
    var tags = self._subrouteNodeNames(sorted_segments_obj[el]);
    Object.keys(tags).forEach(
    function(el) {
      if (Object.keys(self.TAGS).indexOf(tags[el]) === -1) {
        self.TAGS[tags[el]] = index;
        index += 1;
      }
    })
  })
}


ParseUtils.processRoutes = function(rows) {
  /* returns and object where the keys are Path IDs and
     the values are the route's data with the segment
     ranks sorted */

  var self = this;
  var routesObj = {};

  rows = rows.slice();
  rows.forEach(
    function(el, i, a) {
      if (Object.keys(routesObj).indexOf(el["Path ID"].toString()) > -1) {
        routesObj[el["Path ID"]].segments.push(el)
      }
      else {
        routesObj[el["Path ID"]] = {};
        routesObj[el["Path ID"]].segments = [];
        routesObj[el["Path ID"]].path = []
        routesObj[el["Path ID"]].segments.push(el)
       }
  })

  Object.keys(routesObj).forEach(
    function(el, i, arr) {
      routesObj[el].segments.sort(self._compareBySegmentRank);
      routesObj[el].segments = self._cleanLoadUnloadRoutes(routesObj[el].segments)
      self._assignPath(routesObj[el])
  })
  return routesObj;
};


ParseUtils.sankeyLinksFromRoutes = function(data) {
  var links = [],
      nodes = [],
      routes  = Object.keys(data),
      self = this;

  if (Object.keys(self.TAGS).length === 0) {
    console.log("ERR::Need tag ids to assign links")
    return []
  }

  routes.forEach(
  function(route, i, a) {
    data[route].forEach(
    function(path, i, a) {
      /* get ids */
      var src = self.TAGS[path["Segment source"]]; 
      var trg = self.TAGS[path["Segment target"]]; 
      var val = parseFloat(path["Product volume"])
              + parseFloat(path["Solvent"]);
      var link = { source: src, target: trg, value: val }
      links.push(link)
    })
  })
  return links;
}


ParseUtils.sankeyNodesFromRoutes = function(data) {
  var sources = [],
      nodes = [],
      routes  = Object.keys(data),
      self = this;

  if (Object.keys(self.TAGS).length === 0) {
    console.log("ERR::Need tag ids to assign links")
    return []
  }

  routes.forEach(
  function(route, i, a) {
    data[route].forEach(
    function(path, i, a) {
      var src = self.TAGS[path["Segment source"]]; 
      if (sources.indexOf(src) === -1) {
        var node = {node: src, name: path["Segment source"] }
        nodes.push(node)
        sources.push(src)
        if (i === a.length-1) {
          var dest = {node: self.TAGS[path["Segment target"]],
                      name: path["Segment target"]}
          nodes.push(dest)
        }
      }       
    })
  })
  return nodes
}


ParseUtils.addSourceTargetFieldsToRoutes = function(segments) {
  /* in place??? */
  var self = this;
  var tags = self._subrouteNodeNames(segments);

  segments.forEach(
  function(el,i,a) {
      var segs = self._parseSegments(a[i]["Segment name"])
      if (segs.length > 2) {
        /* to handle 'tag - tag - tag'*/
        a[i]["Segment source"] = tags[self._getSegmentTag(segs[0])] 
        a[i]["Segment target"] = tags[self._getSegmentTag(segs[2])] 
      }
      else {
        a[i]["Segment source"] = tags[self._getSegmentTag(segs[0])] 
        a[i]["Segment target"] = tags[self._getSegmentTag(segs[1])] 
      }
  })

  return segments
}


ParseUtils.parseDataByOrder = function(alldata) {
  var data,
      data_by_order = {};
  data = alldata.slice()
  data.forEach(
  function(el, i, a) {
    if (Object.keys(data_by_order).indexOf(el["Order"]) > -1)
      data_by_order[el["Order"]].push(el)
    else 
      data_by_order[el["Order"]] = [el]
  })
  return data_by_order
}


