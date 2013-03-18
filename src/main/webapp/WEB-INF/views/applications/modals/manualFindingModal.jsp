<%@ include file="/common/taglibs.jsp"%>

<a style="margin-left:10px" href="#addManualFinding" role="button" class="btn" data-toggle="modal">Add Manual Finding</a>
<div id="addManualFinding" class="modal hide fade" tabindex="-1"
	role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal"
			aria-hidden="true">X</button>
		<h4><c:if test="${ finding['new'] }">New</c:if> Finding</h4>
	</div>
	<div id="manualFindingFormDiv">
		<%@ include file="/WEB-INF/views/applications/forms/manualFindingForm.jsp" %>
	</div>
</div>