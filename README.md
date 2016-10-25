Exceptio CSV/XLS/XLSX file to JSON
==============================

Simple jQuery CSV/XLS/XLSX to JSON

```
	
	$(document).ready(function() {			
	 	$('#sub').click(function(){
	 		// exXlsOrCsvToJson(fileId, function/object, objectFunction);
		 	// exXlsOrCsvToJson(fileId, function);
	 		exXlsOrCsvToJson('#file', 'my', 'test');		 		
	 	});		 	
	});
	var my = [];
	my['test'] = function(data){			
		$('#output').html('Also check the console log.<br>'+data);
		console.log(data);
	};			
		

```
