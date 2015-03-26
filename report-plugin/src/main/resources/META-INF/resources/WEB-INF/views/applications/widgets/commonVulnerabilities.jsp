<%@ include file="/common/taglibs.jsp"%>
<h4>10 Most Common Vulnerabilities Across Applications</h4>

<div class="comVulns" style="float:left">
    <script type="text/javascript" src="/scripts/common-vulnerabilities-controller.js"></script>
    <script type="text/javascript" src="/scripts/d3.min.js"></script>
    <tabset>
        <tab ng-controller="CommonVulnerabilitiesController" heading="Critical Vulnerabilities" select="setActive(1)">
        </tab>
        <tab ng-controller="CommonVulnerabilitiesController" heading="High Vulnerabilities" select="setActive(2)">
        </tab>
        <tab ng-controller="CommonVulnerabilitiesController" heading="Medium Vulnerabilities" select="setActive(3)">
        </tab>
        <tab ng-controller="CommonVulnerabilitiesController" heading="Low Vulnerabilities" select="setActive(4)">
        </tab>
        <tab ng-controller="CommonVulnerabilitiesController" heading="Info Vulnerabilities" select="setActive(5)">
        </tab>
    </tabset>
</div>
