$(function(){
	$('#calSubmit').click(function(){
		var cal = new Calculator($('#calText').val());
		$('#stdout').html( $('#stdout').html() + cal.calculate() + '<br />');
	});
});