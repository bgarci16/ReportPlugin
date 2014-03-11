var myAppModule = angular.module('threadfix')

myAppModule.controller('VulnTableController', function ($scope, $window, $http, $rootScope) {

    $scope.initialized = false;

    $scope.page = 1;

    $scope.csrfToken = $scope.$parent.csrfToken;

    $scope.heading = '0 Vulnerabilities';

    $scope.goToPage = function() {
        $scope.page = $scope.pageInput;
    }

    var setDate = function(finding) {
        var time = new Date(finding.importTime)
        finding.importTime = (time.getMonth() + "/" + time.getDate() + "/" + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes());
    }

    $scope.expand = function(vuln) {
        vuln.expanded = !vuln.expanded
        vuln.findings.forEach(setDate);
    }

    $scope.toggleAll = function() {
        var check = function(vuln) {
            vuln.checked = !$scope.allSelected;
        }

        $scope.vulns.forEach(check);
    }

    $scope.setCheckedAll = function(checked) {
        if (checked) {
            $scope.allSelected = false;
        } else {

            if ($scope.vulns.filter(function(vuln) {
                return !vuln.checked;
            }).length === 1) { // the checkbox that calls this action isn't checked yet
                $scope.allSelected = true;
            }
        }
    }

    var getTableSortBean = function() {
        return {
            page: $scope.page
        }
    }

    var refresh = function() {
        $scope.loading = true;
        $http.post($window.location.pathname + "/table" + $scope.csrfToken,
                getTableSortBean()).
            success(function(data, status, headers, config) {
                $scope.initialized = true;

                if (data.success) {
                    $scope.vulns = data.object.vulnerabilities;
                    $scope.numVulns = data.object.numVulns;
                    $scope.empty = $scope.numVulns === 0;
                    $rootScope.$broadcast('scans', data.object.scans);

                } else {
                    $scope.output = "Failure. Message was : " + data.message;
                }

                $scope.loading = false;
            }).
            error(function(data, status, headers, config) {
                $scope.errorMessage = "Failed to retrieve team list. HTTP status was " + status;
                $scope.loading = false;
            });
    };

    $scope.$watch('csrfToken', refresh);

    $scope.$watch('page', refresh); // TODO look at caching some of this

    $scope.$watch('numVulns', function() {
        if ($scope.numVulns === 1) {
            $scope.heading = '1 Vulnerability'
        } else {
            $scope.heading = $scope.numVulns + ' Vulnerabilities'
        }
    });

    $scope.$on('scanUploaded', function() {
        $scope.empty = false;
        refresh();
    });

    $scope.$on('scanDeleted', function() {
        refresh();
        $scope.empty = $scope.numVulns === 0;
    });

});