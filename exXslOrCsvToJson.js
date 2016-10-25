/**
*   @author Ahsan Zahid Chowdhury <itszahid.info>
*   @description To get JSON data from CSV/XLS/XLSX file
*               This is a combind plugins of 
                papaparse https://github.com/mholt/PapaParse   
                SheetJS https://github.com/SheetJS/SheetJS.github.io
*   @since 2016-10-25
*   @param fileId String, ID of the input element
*   @param functionNameStr, Name of the function or Name of the object
*   @param functionNameStr2nd, not required, Name of the function if you used obhect on second param
*/


_completeData = [];
function exXlsOrCsvToJson(fileName, functionNameStr, functionNameStr2nd){	
	$file = $(fileName)[0].files[0];
	var name = $file.name;				
	if(/\.(csv)$/i.test(name)){
		$(fileName).parse({
			config: {
				complete: _readCsv,
			},
			complete: function() {
                _convertComplete(functionNameStr, functionNameStr2nd);				
			}
		});

		return _completeData;
	}
	else if(/\.(xls)$/i.test(name)){
		_readXls($(fileName), functionNameStr, functionNameStr2nd);
		
		return _completeData;
	}
	else if(/\.(xlsx)$/i.test(name)){
		_readXlsx($(fileName), functionNameStr, functionNameStr2nd);
		
		return _completeData;
	}
	else
		return 10;

		return 0;				
	
}

function _convertComplete(functionNameStr, functionNameStr2nd){
    var _functionName = window[functionNameStr];
    if (typeof _functionName === "function") 
        _functionName.apply(null, [_completeData]);
    else if (typeof _functionName === "object")
        _functionName[functionNameStr2nd].apply(null, [_completeData]); 
    else                    
        console.log('Function call fail, '+functionNameStr);
}

function _readCsv(res,file){    
	_completeData = res.data;			
}

function _readXls(file, functionNameStr, functionNameStr2nd) {
    // Get The File From The Input		    
    var oFile = $(file)[0].files[0];
    var sFilename = oFile.name;
    // Create A File Reader HTML5
    var reader = new FileReader();
   
    // Ready The Event For When A File Gets Selected
    reader.onload = function(e) {
        var data = e.target.result;
        var cfb = XLS.CFB.read(data, {type: 'binary'});
        var wb = XLS.parse_xlscfb(cfb);
        // Loop Over Each Sheet
        wb.SheetNames.forEach(function(sheetName) {
            // Obtain The Current Row As CSV
            var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);   
            var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);   

            // $("#my_file_output").html(sCSV);
            Papa.parse(sCSV,{                       
                        complete: function(res){
                            _readCsv(res);
                            _convertComplete(functionNameStr, functionNameStr2nd);                            
                        }
                    });		            
        });
    };
    
    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile);
}

function _readXlsx(file, functionNameStr, functionNameStr2nd) {
    // Get The File From The Input
    var oFile = $(file)[0].files[0];
    var sFilename = oFile.name;
    // Create A File Reader HTML5
    var reader = new FileReader();
    
    // Ready The Event For When A File Gets Selected
    reader.onload = function(e) {
        var data = e.target.result;
        var wb = XLSX.read(data, {type: 'binary'});		        
        // Loop Over Each Sheet
        wb.SheetNames.forEach(function(sheetName) {
            // Obtain The Current Row As CSV
            var sCSV = XLSX.utils.make_csv(wb.Sheets[sheetName]);   
            var oJS = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);   

           Papa.parse(sCSV,{                       
                        complete: function(res){
                            _readCsv(res);
                            _convertComplete(functionNameStr, functionNameStr2nd);                            
                        }
                    });
        });
    };
    
    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile);
}