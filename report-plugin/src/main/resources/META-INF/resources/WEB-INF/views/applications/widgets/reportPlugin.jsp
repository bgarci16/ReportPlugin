<%@ include file="/common/taglibs.jsp"%>

<head>
    <style>
        .report-text {
            text-align: center;
            margin-top: 0px;
            font-size: 0px;
            font-weight:bold;
            line-height:0px;
        }
    </style>
</head>

<div class="span6 ng-scope" ng-controller="ReportPluginController">

    <h4 class="ng-binding">{{ heading }}</h4>
    <div class="report-image">
        <div class="report-text ng-binding">
            {{ body }}
        </div>
    </div>

</div>