game.analyse : function ( array ) {
	/*TODO
	- work out 'calculate' function 
	- abstract so it can be re-applied to other games
	- get elapsed time stat
	- get food type
	- incorporate diseases?
	- incorporategame speed?

	*/

	var eatingRate = 0,
		averageCalories = 0,
		foodNumber = 0, 
		cursorDistance = 0, 
		caloriesBurned = 0, 
		exerciseRate = 0, 
		scoreImprovement = 0, 
		exerciseNumber = 0;

	//1. EATING RATE

	for(var i = 0; i < array.length; i++){
		(array[i].name) ? foodNumber ++ : exerciseNumber ++; 
	}

	//for now, game time = game turns

	//EAT RATE
	eatingRate = game.turns/foodNumber;

	//PREFERRED FOOD TYPES -for now average calorie intake

	averageCalories = game.calories/foodNumber;

	//CURSOR ACTIVITY
	//log as distance travelled

	for(var i = 0; i < array.length - 1; i++){
		var value = Math.sqrt(Math.pow( (array[i].original.screenX - array[i + 1].original.screenX) , 2) + Math.pow( (array[i].original.screenY - array[i + 1].original.screenY) , 2) );
		cursorDistance += value;
	}

	//EXERCISE RATE
	exerciseRate = array.length / exerciseNumber;
	//CALORIES BURNED
	caloriesBurned = exerciseNumber * game.calorieUpgrade;

	//THIS VS LAST SCORE
	scoreImprovement = game.finalPoints - game.scoreHistory[game.scoreHistory.length - 1];
	//TODO - AVERAGES AND STUFF FROM REST OF SCORE HISTORY ARRAY

	/*
	//2nd get food click events and their timestamp
	game.events[x].name //if click event does not have a name, don't count
	game.events[x].time;

	//3rd calculate simple & complex:
	//SIMPLE - just divide total time by number of food events to get average
	game.elapsedTime / sum(game.events[x].name)
	//COMPLEX - plot time points on graph to show progress (like Nike+)
	*/
	return {
		eatingRate: eatingRate,
		averageCalories: averageCalories,
		foodNumber: foodNumber,
		cursorDistance: cursorDistance,
		caloriesBurned: caloriesBurned,
		exerciseRate: exerciseRate,
		scoreImprovement: scoreImprovement,
		exerciseNumber: exerciseNumber
	};

},