// Mehdi Lhommeau X. David Henriet B. Cottenceau 
// global variables (INPUTS) 
// var sizeX =  ___;   // number of state transitions
// var sizeU =  ___;   // number of input transitions
// var sizeY =  ___;   // number of output transitions
// var TmaxX =  _____;   // maximal delay value between state transitions
// var TmaxU =  _____;	// maximal delay value between input and state transitions
// var TmaxY =  _____;   // maximal delay value between state and output transitions

// Function to create a matrix
Array.matrix = function (m,n,initial) {
	var mat=[];
	for(var i = 0 ; i < m ; i++){
		var a = [];
		for(var j = 0 ; j < n ; j++){
			a[j] = initial;
		}
		mat[i] = a;
	}
	return mat;
};

//Function to create a vector
Array.vect = function (n,initial) {
	var a=[];
	for(var i=0 ; i < n ; i++){
		a[i] = initial;
	}
	return a;
}

//Vectors for timing patterns of events 
var X = Array.matrix(sizeX,TmaxX + 1, 0);
var U = Array.matrix(sizeU,TmaxU + 1, 0);
var Y = Array.matrix(sizeY,TmaxY + 1, 0);

//Stock matrices
var XX = Array.matrix(sizeX,sizeX,Number.NEGATIVE_INFINITY);
var XU = Array.matrix(sizeX,sizeU,Number.NEGATIVE_INFINITY);
var YX = Array.matrix(sizeY,sizeX,Number.NEGATIVE_INFINITY);

// Matrices for initial markings
var XX_init = Array.matrix(sizeX,sizeX,Number.NEGATIVE_INFINITY);
var XU_init = Array.matrix(sizeX,sizeU,Number.NEGATIVE_INFINITY);
var YX_init = Array.matrix(sizeY,sizeX,Number.NEGATIVE_INFINITY);

// Vectors of weights (unitary)
var Wm=Array.matrix(sizeX,sizeX,1);  //multiplier = trans->place weight
var Wb=Array.matrix(sizeX,sizeX,1);  //batch = place->trans weight
var UWm=Array.matrix(sizeX,sizeU,1);  //multiplier input -> state (trans->place weight)
var UWb=Array.matrix(sizeX,sizeU,1);  //batch input -> state (place->trans weight)
var OWm=Array.matrix(sizeY,sizeX,1);  //multiplier state -> ouptut (place->trans weight)
var OWb=Array.matrix(sizeY,sizeX,1);  //batch state->output (place->trans weight)

var Stop = true;
var Started = false;

//Variable for the time
var t=0;

// Starting or continuing a simulation
$("#startSimulation").click(function(){
	if( Started == false){
		Started = true;
		Stop = false;		
  		t = 0;  // Initialize time  		
		Animation(); // Run simulation
	}	
	else   // Continuing a simulation
	{
		Stop = false;
		Animation();
	}
});

// Stopping a simulation
$("#stopSimulation").click(function(){
	Stop = true;
});

// Showing the tokens according to the stock matrix
function ShowToken(){
 	
 	for(var i = 0 ; i < sizeX ; i++) // Showing the tokens between state transitions
	for(var j = 0 ; j < sizeX ; j++)
	{
		if(XX[i][j] > 2){		// Displays a string for a marking >2	
			$('#tx'+String(i+1)+'x'+String(j+1),$svg).show();
			$('#tx'+String(i+1)+'x'+String(j+1),$svg).text(XX[i][j]);
		}
		else{
			for(k = 1 ; k <= XX[i][j] ; k++){
				$('#x'+String(i+1)+'x'+String(j+1) + '_' + String(k),$svg).show();
			}
		}	
	}
	
	for(var i = 0 ; i < sizeX ; i++) // Showing the tokens inputs->state transitions
	for(var j = 0 ; j < sizeU; j++)
	{
		if(XU[i][j] > 2){			
			$('#tx'+String(i+1)+'u'+String(j+1),$svg).show();
			$('#tx'+String(i+1)+'u'+String(j+1),$svg).text(XU[i][j]);
		}
		else{
			for(k = 1 ; k <= XU[i][j] ; k++){
				$('#x'+String(i+1)+'u'+String(j+1) + '_' + String(k),$svg).show();
			}
		}
	}
	
	for(var i = 0 ; i < sizeY ; i++) // Showing the tokens state->output transitions
	for(var j = 0 ; j < sizeX; j++)
	{
		if(YX[i][j] > 2){			
			$('#ty'+String(i+1)+'x'+String(j+1),$svg).show();
			$('#ty'+String(i+1)+'x'+String(j+1),$svg).text(YX[i][j]);			
		}
		else{
			for(k = 1 ; k <= YX[i][j] ; k++){
				$('#y'+String(i+1)+'x'+String(j+1) + '_' + String(k),$svg).show();
			}
		}
	}
}

function HideToken(){  	// Hide all tokens 	
 	for(var i = 0 ; i < sizeX ; i++) // Hiding the tokens state->state
	for(var j = 0 ; j < sizeX ; j++)
	{
		if(XX[i][j] > -1){		
			$('#tx'+String(i+1)+'x'+String(j+1),$svg).hide();			
			for(var k = 1 ; k <= 2 ; k++){
				$('#x'+String(i+1)+'x'+String(j+1) + '_' + String(k),$svg).hide();
			}
		}	
	}
	
	for(var i = 0 ; i < sizeX ; i++) // Hiding the tokens input->state
	for(var j = 0 ; j < sizeU; j++)
	{
		if(XU[i][j] > -1){			
			$('#tx'+String(i+1)+'u'+String(j+1),$svg).hide();
			for(var k = 1 ; k <= 2 ; k++){
				$('#x'+String(i+1)+'u'+String(j+1) + '_' + String(k),$svg).hide();
			}
		}
	}
	
	for(var i = 0 ; i < sizeY ; i++) // Hiding the tokens state->input
	for(var j = 0 ; j < sizeX; j++)
	{
		if(YX[i][j] > -1){			
			$('#ty'+String(i+1)+'x'+String(j+1),$svg).hide();
			for(var k = 1 ; k <= 2 ; k++){
				$('#y'+String(i+1)+'x'+String(j+1) + '_' + String(k),$svg).hide();
			}
		}
	}
}

function UpdateFig(){  //Update Fig.
	HideToken();
	ShowToken();
}

function StockInit() 
{
for(var i = 0; i<sizeU; i++){
		$('#u'+String(i+1)+'_tok',$svg).text(U[i][TmaxU]);
	}
	for(var i = 0; i<sizeY; i++){
		$('#y'+String(i+1)+'_tok',$svg).text(Y[i][TmaxY]);
	}
		
	// Copy the stock matrices in the matrices for the initial marking
 	for(var i = 0 ; i < sizeX ; i++)
	for(var j = 0 ; j < sizeX ; j++)
	{
		XX_init[i][j] = XX[i][j];	
	}
	// Hiding the tokens for the places from an input event to a state event
	for(var i = 0 ; i < sizeX ; i++)
	for(var j = 0 ; j < sizeU; j++)
	{
		XU_init[i][j] = XU[i][j];
	}
	// Hiding the tokens for the places from a state event to an output event
	for(var i = 0 ; i < sizeY ; i++)
	for(var j = 0 ; j < sizeX; j++)
	{
		YX_init[i][j] = YX[i][j];
	}
	$('#horloge', $svg).text("Time: "+t);
}

function UpdateStock() {    // Updating stock s
 	
 	for(var i = 0 ; i < sizeX ; i++)  // Stock between state transitions
	for(var j = 0 ; j < sizeX ; j++)
	{
		if(XX[i][j] > -1){  // take weights into account
			XX[i][j] = Wm[i][j]*X[j][TmaxX] - Wb[i][j]*X[i][TmaxX] + XX_init[i][j];
		}	
	}
	
	for(var i = 0 ; i < sizeX ; i++) // Stock from inputs -> states
	for(var j = 0 ; j < sizeU; j++)
	{
		if(XU[i][j] > -1){
			XU[i][j] = UWm[i][j]*U[j][TmaxU] - UWb[i][j]*X[i][TmaxX] + XU_init[i][j];
		}
	}
	
	for(var i = 0 ; i < sizeY ; i++) // Stock from states -> outputs
	for(var j = 0 ; j < sizeX; j++)
	{
		if(YX[i][j] > -1){
			YX[i][j] = OWm[i][j]*X[j][TmaxX] - OWb[i][j]*Y[i][TmaxY] + YX_init[i][j];
		}
	}
}

function subAnim(){	
	$('#horloge', $svg).text("Time: "+t);   // show current Time
	
	for(var i = 0; i<sizeU; i++){  // show input counter values
			$('#u'+String(i+1)+'_tok',$svg).text(U[i][TmaxU]);
	}
	for(var i = 0; i<sizeY; i++){  // show output counter values
		$('#y'+String(i+1)+'_tok',$svg).text(Y[i][TmaxY]);
	}
	
	for(var i=0 ; i < sizeX ; i++)
	for(var j=0 ; j < TmaxX; j++)
			X[i][j] = X[i][j+1];
			
	for(var i=0 ; i < sizeY ; i++)
	for(var j=0 ; j < TmaxY ; j++)
			Y[i][j] = Y[i][j+1];
			
	for(var i=0 ; i < sizeU ; i++)
	for(var j=0 ; j < TmaxU ; j++)
			U[i][j] = U[i][j+1];
}
