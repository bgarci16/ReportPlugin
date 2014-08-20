var d3ThreadfixModule = angular.module('threadfix');

// Months Summary report
d3ThreadfixModule.directive('d3Vbars', ['$window', '$timeout', 'd3', 'threadFixModalService', 'vulnSearchParameterService',
    function($window, $timeout, d3, threadFixModalService, vulnSearchParameterService) {
        return {
            restrict: 'EA',
            scope: {
                data: '=',
                label: '='
            }
            ,
            link: function(scope, ele, attrs) {
                var margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = 422 - margin.left - margin.right,
                    height = 250 - margin.top - margin.bottom;

                var x = getScaleOrdinalRangeBand(d3, [0, width], .1);

                var y = getScaleLinearRange(d3, [height, 0]);

                var color = getScaleOrdinalRange(d3, vulnTypeColorList);

                var xAxis = getAxis(d3, x, "bottom");

                var yAxis = getAxisFormat(d3, y, "left", d3.format(".2s"));

                var svg = getSvg(d3, ele[0], width + margin.left + margin.right, height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var tip = getTip(d3, 'd3-tip', [-10, 0])
                    .html(function(d) {
                        return "<strong>" + d.tip + ":</strong> <span style='color:red'>" + (d.y1 - d.y0) + "</span>";
                    });
                svg.call(tip);

                scope.$watch('data', function(newVals) {
                    scope.render(newVals);
                }, true);

                scope.render = function (reportData) {
                    var data = angular.copy(reportData);
                    svg.selectAll('*').remove();

                    if (!data || data.length < 1) return;

                    barGraphData(d3, data, color, true, scope.label);

                    x.domain(data.map(function(d) { return d.title; }));
                    y.domain([0, d3.max(data, function(d) { return d.total; })]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end");

                    var col = svg.selectAll(".title")
                        .data(data)
                        .enter().append("g")
                        .attr("class", "g")
                        .attr("transform", function(d) { return "translate(" + x(d.title) + ",0)"; });

                    var drawTime = -1;
                    var colDuration = drawingDuration/data.length;
                    col.selectAll("rect")
                        .data(function(d) { return d.vulns; })
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("width", 0)
                        .attr("y", function(d) { return y(d.y1); })
                        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                        .style("fill", function(d) { return d.fillColor; })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)
                        .on('click', function(d) {
                            tip.hide();
                            threadFixModalService.showVulnsModal(vulnSearchParameterService.createFilterCriteria(d, scope.label), scope.label.teamId || scope.label.appId);
                        })
                        .transition()
                        .attr("width", x.rangeBand())
                        .duration(colDuration)
                        .delay(function(d) {
                            if (d.y0 === 0)
                                drawTime++;
                            return colDuration*drawTime; }) ;
                };
                ;
            }
        }
    }]);


// Top Applications Summary report
d3ThreadfixModule.directive('d3Hbars', ['$window', '$timeout', 'd3', 'threadFixModalService', 'vulnSearchParameterService',
    function($window, $timeout, d3, threadFixModalService, vulnSearchParameterService) {
        return {
            restrict: 'EA',
            scope: {
                data: '=',
                label: '='
            }
            ,
            link: function(scope, ele, attrs) {
                var margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = 422 - margin.left - margin.right,
                    height = 250 - margin.top - margin.bottom;

                var x = getScaleLinearRange(d3, [0, width]);

                var y = getScaleOrdinalRangeBand(d3, [0, height], .1);

                var color = getScaleOrdinalRange(d3, vulnTypeColorList);

                var xAxis = getAxis(d3, x, "bottom");

                var yAxis = getAxis(d3, y, "left");

                var svg = getSvg(d3, ele[0], width + margin.left + margin.right, height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var tip = getTip(d3, 'd3-tip', [-10, 0])
                    .html(function(d) {
                        return "<strong>" + d.tip + ":</strong> <span style='color:red'>" + (d.y1 - d.y0) + "</span>";
                    });
                svg.call(tip);

                scope.$watch('data', function(newVals) {
                    scope.render(newVals);
                }, true);

                scope.render = function (reportData) {
                    var data = angular.copy(reportData);
                    svg.selectAll('*').remove();

                    if (!data || data.length < 1) return;

                    barGraphData(d3, data, color, false, scope.label);

                    y.domain(data.map(function(d) { return d.title; }));
                    x.domain([0, d3.max(data, function(d) { return d.total; })]);

                    svg.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "x axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end");

                    var col = svg.selectAll(".title")
                        .data(data)
                        .enter().append("g")
                        .attr("class", "g")
                        .attr("transform", function(d) { return "translate(0," + y(d.title) + ")"; });

                    var drawTime = -1;
                    var rowDuration = drawingDuration/data.length;

                    col.selectAll("rect")
                        .data(function(d) { return d.vulns; })
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("height", 0)
                        .attr("x", function(d) { return x(d.y0); })
                        .attr("width", function(d) { return x(d.y1) - x(d.y0); })
                        .style("fill", function(d) { return d.fillColor; })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)
                        .on('click', function(d) {
                            tip.hide();
                            threadFixModalService.showVulnsModal(vulnSearchParameterService.createFilterCriteria(d, scope.label), scope.label.teamId || scope.label.appId);
                        })
                        .transition()
                        .attr("height", y.rangeBand())
                        .duration(rowDuration)
                        .delay(function(d) {
                            if (d.y0 === 0)
                                drawTime++;
                            return rowDuration*drawTime; })
                    ;
                };
                ;
            }
        }
    }]);

// Donut
d3ThreadfixModule.directive('d3Donut', ['$window', '$timeout', 'd3', 'd3donut',
    function($window, $timeout, d3, d3donut) {
        return {
            restrict: 'EA',
            scope: {
                data: '=',
                label: "@"
            }
            ,
            link: function(scope, ele, attrs) {

                var color = getScaleOrdinalRange(d3, vulnTypeColorList);

                scope.$watch('data', function(newVals) {
                    scope.render(newVals);
                }, true);

                scope.render = function (reportData) {
                    var data = angular.copy(reportData);

                    if (!data)
                        return;

                    color.domain(vulnTypeList);

                    var pieDim ={w:260, h: 200};

                    var svg = getSvg(d3, ele[0], pieDim.w, pieDim.h)
                        .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

                    svg.append("g").attr("id",scope.label);

//                    d3donut.draw3D(scope.label, getData(), 135, 90, 85, 55, 30, 0.4);
                    d3donut.draw2D(scope.label, getData(), 200, 260);

                    function getData(){
                        var d = data[0];
                        return color.domain().map(function(vulnType) {
                            return {tip:vulnType, value:d[vulnType], fillColor:color(vulnType), severity: vulnType, teamId: d.teamId, teamName: d.teamName};});
                    }

                };
                ;
            }
        }
    }]);


/*** UTILITY FUNCTIONS ***/

function getScaleOrdinalRange(d3, range) {
    return d3.scale.ordinal()
        .range(range);
}

function getScaleOrdinalRangeBand(d3, range, scale) {
    return d3.scale.ordinal()
        .rangeRoundBands(range, scale);
}

function getScaleLinearRange(d3, range) {
    return d3.scale.linear()
        .rangeRound(range);
}

function getAxis(d3, scale, orient) {
    return  d3.svg.axis()
        .scale(scale)
        .orient(orient);
};

function getAxisFormat(d3, scale, orient, format) {
    return  getAxis(d3, scale, orient)
        .tickFormat(format);
};

function getSvg(d3, elementId, w, h) {
    return d3.select(elementId).append("svg")
        .attr("width", w)
        .attr("height", h);
}

function getTip(d3, clazz, offset) {
    return d3.tip()
        .attr('class', clazz)
        .offset(offset);
}

function barGraphData(d3, data, color, isLeftReport, label) {
    var keys = d3.keys(data[0]).filter(function(key) { return key; });
    var topVulnsReport = false;

    if (keys.indexOf("count") > -1) {
        color.domain(topVulnMapKeyword);
        topVulnsReport = true;
    }
    else
        color.domain(vulnTypeList);

    data.forEach(function(d, index) {
        var y0 = 0;
        d.vulns = color.domain().map(function(key) {
            //If it is top vulnerability report, then pick color of "High"
            var _key = (topVulnsReport) ? "High" : key;
            var tip = (topVulnsReport) ? d.name + " (CWE " + d.displayId + ")" : key;
            return {
                time: (isLeftReport) ? getTime(data.length-index) : undefined,
                fillColor: color(_key),
                tip : tip,
                y0: y0,
                y1: y0 += +d[key],
                teamId: (label && label.teamId) ? label.teamId : d.teamId,
                teamName: d.teamName,
                appId: (label && label.appId) ? label.appId : d.appId,
                appName: d.appName,
                severity: (topVulnsReport) ? undefined : key
            };
        });
        d.total = d.vulns[d.vulns.length - 1].y1;
    });
}

//function createFilterCriteria(d, label) {
//    var criteria = {};
//    criteria.endDate = d.time;
//    criteria.parameters = {};
//    criteria.parameters.severities = {
//        info: d.severity === "Info",
//        low: d.severity === "Low",
//        medium: d.severity === "Medium",
//        high: d.severity === "High",
//        critical: d.severity === "Critical"
//    };
//
//    if (d.teamId && label.teamId) {
//        criteria.treeTeam = {id: d.teamId};
//    } else if (d.teamId) {
//        criteria.parameters.teams = [{id: d.teamId, name: d.teamName}];
//        criteria.teams = [];
//    } else {
//        criteria.parameters.teams = [];
//        criteria.teams = [];
//    }
//
//    if (d.appId && label.appId) {
//        criteria.treeApplication = {id: d.appId};
//    } else if (d.appId) {
//        criteria.parameters.applications = [{id: d.appId, name: d.teamName + " / " + d.appName}];
//        criteria.searchApplications = [];
//    } else {
//        criteria.parameters.applications = [];
//        criteria.searchApplications = [];
//    }
//
//    criteria.parameters.channelTypes = [];
//    criteria.parameters.scanners = [];
//    criteria.scanners = [];
//    criteria.parameters.genericVulnerabilities = [];
//    if (d.tip.indexOf("CWE") > -1)
//        criteria.parameters.genericVulnerabilities = [{name: d.tip}];
//    criteria.parameters.showOpen = true;
//    criteria.parameters.showClosed = false;
//    criteria.parameters.showFalsePositive = false;
//    criteria.parameters.showHidden = false;
//
//    return criteria;
//
//}

function getTime(index) {
    return new Date(currentYear, currentMonth - index + 2, 0);
}
var vulnTypeColorList = ["#014B6E", "#458A37", "#EFD20A", "#F27421", "#F7280C"];
var vulnTypeList = ["Info", "Low", "Medium", "High", "Critical"];
var topVulnMapKeyword = ["count"];
var drawingDuration = 500;
var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var currentMonth = currentDate.getMonth();
