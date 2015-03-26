var myAppModule = angular.module('threadfix');

myAppModule.controller('CommonVulnerabilitiesController', function ($scope, $window, $modal, $http, $log, $rootScope, tfEncoder) {

    $scope.level = 1;
    $scope.setActive = function(n){
        $scope.level = n;
        $scope.$broadcast('setSeverityLevel');

    };

    $scope.$on('setSeverityLevel', function(){
        $http.post(tfEncoder.encode("reportplugin/commv/")).// + $scope.level)).
            success(function (data) {
                $scope.cwe = null;
                $scope.cwe = data.object.cwe;

        d3.select(".comVulns").select("svg").remove();
        var m = [30, 10, 10, 30],
            w = 300 - m[1] - m[3],
            h = 400 - m[0] - m[2];

        var format = d3.format(",.0f");

        var x = d3.scale.linear()
            .range([0, w]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, h],.5);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(7)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(0)
            .orient("left");

        var svg = d3.select(".comVulns")
            .append("svg")
            .attr("width", w + m[1] + m[3] + 20)
            .attr("height", h + m[0] + m[2])
            .append("g")
            .attr("transform", "translate(50,0)");

        // Parse numbers, and sort by value.
        $scope.cwe.forEach(function(d) { d.count = +d.count; });
        $scope.cwe.sort(function(a, b) { return b.count - a.count; });


        // Set the scale domain.
        x.domain([0, d3.max($scope.cwe, function(d) { return d.count + .5; })]);
        y.domain($scope.cwe.map(function(d) { return d.name; }));

        var bar = svg.selectAll("g.bar")
            .data($scope.cwe)
            .enter()
            .append("g")
            .attr("class", "bar")
            .style({'stroke': 'black', 'fill': function(){
                    if($scope.level == 1)
                        return "#F7280C";
                    else if($scope.level == 2)
                        return "#F27421";
                    else if($scope.level == 3)
                        return "#EFD20A";
                    else if($scope.level == 4)
                        return "#458A37";
                    else
                        return "#014B6E";
                }, 'stroke-width': '1px'})
            .attr("transform", function(d) { return "translate(15," + y(d.name) +")"; });

        bar.append("rect")
            .attr("width", function(d) { return x(d.count); })
            .attr("height", y.rangeBand());

        bar.append("text")
            .attr("class", "value")
            .attr("x", function(d) { return x(d.count); })
            .attr("y", y.rangeBand() / 2)
            .attr("dx", -3)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .style({'stroke': 'white', 'fill': 'none', 'stroke-width': '1px'})
            .text(function(d) { return format(d.count); });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(15," + (h - 5) + ")")
            .style({'stroke': 'gray', 'fill': 'none', 'stroke-width': '1px'})
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(15, 1)")
            .style({ 'stroke': 'gray', 'fill': 'none', 'stroke-width': '1px'})
            .call(yAxis);

        var xLabel = svg.append("text")
            .attr("x", 350)
            .attr("y", 390)
            .attr("class", "axis wcm-label")
            .text("Number of Applications")
            .attr("font-size", "12px")
            .attr("font-family", "sans-serif")
            .attr("fill", "black");
        })
    });
});
