
<table class="table table-striped">
	<thead>
		<tr>
			<th style="width:500px">Vulnerability Type (CWE)</th>
			<th style="width:50px">Severity</th>
			<th style="width:50px">Type</th>
			<th style="width:130px"></th>
		</tr>
	</thead>
	<tbody>
        <tr ng-hide="currentVulnFilters" class="bodyRow">
            <td colspan="4" class="centered">No filters found.</td>
        </tr>
        <tr ng-show="currentVulnFilters" ng-repeat="vulnFilter in currentVulnFilters" class="bodyRow">
            <td id="genericVulnerability{{ $index }}">
                {{ vulnFilter.sourceGenericVulnerability.name }}
            </td>
            <td style="word-wrap: break-word;">
                <div id="genericSeverity{{ $index }}" ng-if="!vulnFilter.targetGenericSeverity">
                    Ignore
                </div>
                <div id="genericSeverity{{ $index }}" ng-if="vulnFilter.targetGenericSeverity">
                    {{ vulnFilter.targetGenericSeverity.name }}
                </div>
            </td>
            <td>
                {{ type }}
            </td>
            <td id="edit{{ $index }}">
                <a class="btn" ng-click="editFilter(vulnFilter)">Edit/Delete</a>
            </td>
        </tr>
	</tbody>
</table>
