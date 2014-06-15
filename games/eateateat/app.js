(function () {

	'use strict';

	/* TODO
	
		* CSS improvements for game
			* when score increases, make more obvious
		* info pop up boxes?
		* review code 
		* add logic for:
			- unlocking cells
			- generating player rating
		* add audio
		* add tip array
		* review anorexia (and other - calories diseases) implementation

	*/

	var game = {
		// Initialise the view
		render: function ( template ) {
			game.view = new Ractive({
				el: 'container',
				template: template,
				data: {

					dialog: true,
					upgrade1Bought: true,
					upgrade2Bought: true,
					upgrade3Bought: true

				}
			});


			game.view.on({
				start: function (event, number){
					game.start(number);
				},

				timer: function () {
					game.timer();
				},

				selectFood: function(event, foodItemNumber ){
					game.selectFood( foodItemNumber );
					game.captureEvent( event );
				},

				speedSetting: function (){
					game.speedSetting();
				},

				exercise: function( event ) {
					game.exercise();
					game.captureEvent( event );
				},

				disease: function(){
					game.disease();
				},

				buyUpgrades: function ( event, number) {
					game.buyUpgrades ( number );
				},

				gameOver: function (){
					game.gameOver();
				},

				playAgain: function (event){ 
					game.reset();
					game.start();
				},

				viewUpgrades: function ( event, label){
					game.viewUpgrades( label );
				},

				tooltip: function (event, a){
					game.tooltip( a );
				},

				viewCellTrophies: function ( event, label){
					game.viewCellTrophies( label );
				},

				analyse: function (event, array){
					game.analyse( array );
				}
			});
		},

		reset: function () {
			
			game.view.set({

					instructions:true,
					dialogDisease: null,
					diaEnd: false,
					diaEndEarly: false,
					dialog: false,
					noClicks: false,
					disease1: false,
					disease2: false,
					disease3: false,
					disease4: false,
					disease5: false,
					disease6: false,
					disease7: false,
					disease8: false,
					disease9: false,
					disease10: false,
					//if set to 'null' IE displays it, so set to blank space instead
			        zeroPointsReason: ' '
				
			});
		},

		// Start a new round
		start: function (number) {

			//reset Ractive tags
			game.reset();

			// shuffle food data
			shuffle(game.food);
		
			//set stats to 0 for each playthrough
			game.points = 0;
			game.turns = 0;
			game.calories = 0;

			//check if points upgrade is purchased or not
			if(typeof game.pointsUpgrade ==='undefined'){
				game.pointsUpgrade = 0;
			}

			//reset time penalty- this figure is changed as calories increase and causes time to speed up
			game.timePenalty = 1;
			//actually, chance of death is % chance of NOT dying. so starts at 100
			game.chanceOfDeath = 100;
			//array to capture click events
			game.events = [];

			//array keeps track of scores
			if(typeof game.scoreHistory ==='undefined'){
				game.scoreHistory = [];
	
			}
			//keeps track of time spent reading extra info
			if(typeof game.readingTime ==='undefined'){
				game.readingTime = 0;
	
			}

			//speed upgrade represents speed upgrades the player can get. Also represents initial timer increment of 100 mili secs
			if(typeof game.speedUpgrade === 'undefined'){
			game.speedUpgrade = 100;
			}

			if(typeof game.calorieUpgrade === 'undefined'){
			game.calorieUpgrade = 100;	
			}
			
			//assign gender based on the player's input
			function setTurns(number){
					if(number == 1){
						game.gender = 'woman';
						game.turnLimit = 82; //82;
					}else{
						game.gender = 'man';
						game.turnLimit = 79; //79;
					}
				}
			
			//check if gender is undefined - ie: it's player's first go. If not, gender will be carried over from the last game
			if(typeof game.gender === 'undefined'){	
			setTurns(number);
			}

			//timeLimit is the number of seconds per turn
			game.timeLimit = 1;

			//clone disease data
			game.diseases = game.diseaseList.slice();

			//clone cell trophy list - for now not needed so commented out

			//game.cellList = game.cellTrophy.slice();

			//create disease history array
			game.diseaseHistory = [];

			//call timer func to start game
			game.timer();

			// create food grid and stat counters
			game.view.set({
				foodGrid: true,
				dialog: false,
				foodItem1: game.food[0],
				foodItem2: game.food[1],
				foodItem3: game.food[2],
				foodItem4: game.food[3],
				foodItem5: game.food[4],
				foodItem6: game.food[5],
				foodItem7: game.food[6],
				foodItem8: game.food[7],
				foodItem9: game.food[8],
				foodItem10: game.food[9],
				foodItem11: game.food[10],
				foodItem12: game.food[11],
				'stats.points': game.points,
				'stats.calories': game.calories
				
			});


		},

		//timer function. counts up to a set time then resets and starts again- this represents a 'turn' (game.turns tracks these)
		timer: function(){
			var time = 0, timerOn = true;


			

			function increment(){ 
				//as increment calls itself, check again that there are turns remaining
				if(timerOn && game.turns < game.turnLimit){

							if(Math.random() * 90 > game.chanceOfDeath){
								game.gameOverEarly();
								timerOn = false;
							} else {


				setTimeout(function(){
					//this function calculates the speed
						game.speedSetting();
						time++;

						var mins = Math.floor(time/10/60);
						var secs = Math.floor(time/10);
						var tenths = time % 10;
						//resets the view every time game.timeLimit is reached
						if(secs == game.timeLimit) {
							time = 0;
							shuffle(game.food)
									game.view.set({
										foodItem1: game.food[0],
										foodItem2: game.food[1],
										foodItem3: game.food[2],
										foodItem4: game.food[3],
										foodItem5: game.food[4],
										foodItem6: game.food[5],
										foodItem7: game.food[6],
										foodItem8: game.food[7],
										foodItem9: game.food[8],
										foodItem10: game.food[9],
										foodItem11: game.food[10],
										foodItem12: game.food[11]
										});
							game.turns ++;

							}

						if(secs < 10){
							secs = '0' + secs};

								game.view.set({

									//'timer.mins': mins,
									//'timer.secs': secs,
									//'timer.tenths': tenths,
									turns: game.turns

								});
								//calls itself- the timer keeps going
								increment();
								game.disease();
								
									
							}, game.speed);
									}

								} else {
									//check to see if turns have run out, if they have go to natural death ending
									//else do nothing- the premature ending will already be triggered

										game.gameOver();

								}		
							

				}
			increment();
			
			},		


		//calculates the game speed, which is passed into the timer function. Putting this in a separate place makes it easier to control this vital func
		speedSetting: function () {
			game.speed = game.speedUpgrade * (1/(1 + Math.sqrt(Math.pow((game.calories/1000),2)))) / game.timePenalty;
			return game.speed;


		},


		// when player clicks a food item, calories and points added, and food item changes.
		selectFood: function ( foodItemNumber ) {
			

			if( game.turns != game.turnLimit ){

			game.points += game.food[foodItemNumber-1].points + game.pointsUpgrade;
			game.calories += game.food[foodItemNumber-1].calories;
			/*
			if(game.food[foodItemNumber-1].calories > 200){
			var snd = new Audio('assets/sound/bad.mp3');
			snd.play();

			} else {
			var snd = new Audio('assets/sound/good.mp3');
			snd.play();
			}
			*/
			game.view.set({
				'stats.points': game.points,
				'stats.calories': game.calories

				});



			}

		},


		captureEvent: function ( event ){
			if( !event ) event = window.event;
			var e = {};

			e.context = event.context;
			e.pageX = event.original.pageX;
			e.pageY = event.original.pageY;
			e.time = new Date();
			e.calories = game.calories;



			game.events.push( e );


		},

		//controls the exercise option
		exercise: function () {
		if( game.turns != game.turnLimit  ){
			game.calories -= game.calorieUpgrade;
			game.view.set('stats.calories', game.calories)
			}
		},

		disease: function() {
			//when player clicks on a food item, this checks to see if calorie count = a disease. last item in array is a dummy one as shift doesn't work if an item is the last in an array
			var anorexia;

			//HARD CODED ANOREXIA DISEASE- REVIEW THIS LATER

			if(game.calories <= -4000 && typeof game.diseases[10] !=='undefined') { 
				anorexia = game.diseases.splice(10, 1);
				game.view.set('dialogDisease', anorexia);
				game.diseaseHistory.push(anorexia);
				game.timePenalty += game.diseaseHistory[game.diseaseHistory.length - 1][0].timePenalty;
				game.chanceOfDeath = game.diseaseHistory[game.diseaseHistory.length - 1][0].earlyDeathRisk;
			}


			for(var i=0; i<game.diseases.length; i++){

				if(game.calories >= game.diseases[i].calories){
					//if match is found, remove that element from the array (altering the array is fine as it will be 
					//re-instated at the start of each game)

					game.tempDisease = game.diseases.splice(i, 1);
					game.diseaseHistory.push(game.tempDisease);
					//add it to the disease history array
					//game.diseaseHistory.push(a);

					game.view.set({
						dialogDisease: game.tempDisease
						/*'stats.timePenalty': a.timePenalty, //for troubleshooting - displays timepenalty and last disease name
						'stats.name': game.diseases[0].name*/
					});
					game.timePenalty += game.diseaseHistory[game.diseaseHistory.length - 1][0].timePenalty;
					game.chanceOfDeath = game.diseaseHistory[game.diseaseHistory.length - 1][0].earlyDeathRisk;

				}
			}
			return game.timePenalty;
		},


		//allows players to buy upgrades. first checks for if they have enough points to buy the requested upgrade, and if they do, alters the associated game variable
		buyUpgrades: function ( upgradeNumber ){
		if(game.upgradesList[upgradeNumber-1].cost > game.finalPoints){
			alert("You don't have enough points to buy this upgrade! Keep playing to build up points");
		}else{
			if(game.upgradesList[upgradeNumber-1].affects == 'calories'){
				game.calorieUpgrade += game.upgradesList[upgradeNumber-1].benefit;
				alert("Congratulations! You now burn more calories doing exercise!");
				game.finalPoints -= game.upgradesList[upgradeNumber-1].cost;
				game.view.set('finalScore', game.finalPoints);

					
						}else{
							if(game.upgradesList[upgradeNumber-1].affects =='speed'){
							game.speedUpgrade += game.upgradesList[upgradeNumber-1].benefit;
							alert("Congratulations! You're healther so you have more time per year to enjoy life!");
							game.finalPoints -= game.upgradesList[upgradeNumber-1].cost;
							game.view.set('finalScore', game.finalPoints);

													}
									 else{
										if(game.upgradesList[upgradeNumber-1].affects == 'points'){
										game.pointsUpgrade += game.upgradesList[upgradeNumber-1].benefit;
										alert("Congratulations! You get more points per food item.");
										game.finalPoints -= game.upgradesList[upgradeNumber-1].cost;
										game.view.set('finalScore', game.finalPoints);
												}
										}
							}

					if(upgradeNumber==1){
						game.view.set({
							upgrade1: false,
							upgrade1Bought: false

							});

					}

					if(upgradeNumber==2){
						game.view.set({
							upgrade2: false,
							upgrade2Bought: false

							});
					}

					if(upgradeNumber==3){
						game.view.set({
							upgrade3: false,
							upgrade3Bought: false

							});
					}
			}

		},

		gameOver: function() {


			game.finalPoints = (game.points - game.calories <= 0) ? 0 : game.points - Math.abs(game.calories);

			if(game.finalPoints == 0){
				game.view.set('zeroPointsReason', 'because you had more calories than points :( ');
			}

			if(game.diseaseHistory.length > 3){
				var a = 'This patient is very unhealthy';
			} else {
				var a = 'This patient is healthy';
			}

			game.analyse(game.events);

			if(game.finalPoints == 0){
				game.view.set('scoreGraph', false);
			} else {
				game.view.set('scoreGraph', true);

			}

			if(!game.scoreHistory[0]){
				game.scoreHistory[0] = game.finalPoints;
				game.scoreHistory[1] = game.finalPoints;
			} else {
				if(game.finalPoints > game.scoreHistory[1]){
					game.scoreHistory[1] = game.finalPoints;
				} else {
					game.view.set('hasScoreImproved', 'not');
				}
			}



			if(game.events.length > 0){

			if(game.diseaseHistory.length == 0){
				game.view.set('doctor', 'You are very healthy, well done');
			} else {
				game.view.set({
					doctor: 'Patient has following heath issues:',
					disease1: game.diseaseHistory[0],
					disease2: game.diseaseHistory[1],
					disease3: game.diseaseHistory[2],
					disease4: game.diseaseHistory[3],
					disease5: game.diseaseHistory[4],
					disease6: game.diseaseHistory[5],
					disease7: game.diseaseHistory[6],
					disease8: game.diseaseHistory[7],
					disease9: game.diseaseHistory[8],
					disease10: game.diseaseHistory[9]
				})
			}
			//unused scatter graph, not needed for now
			//test( game.events );

			game.view.set({
				finalScore: game.finalPoints,
				diaEnd: true,
				tip: 'Tip: More calories = faster game as research suggests being overweight speeds ageing!',
				upgrade1: game.upgradesList[0],
				upgrade2: game.upgradesList[1],
				upgrade3: game.upgradesList[2],
				readingTime: game.readingTime,
				cursorDistance: game.playerRatings.cursorDistance


			});

			pieChart( game.events );
			barChart();
			twttr.widgets.load();
			game.view.set('preferredFoodType',game.preferredFoodType.name);

				} else {
			game.view.set({
					noClicks: true
			});
				}

		},

		gameOverEarly: function() {
			game.finalPoints = (game.points - game.calories <= 0) ? 0 : game.points - Math.abs(game.calories);

			if(game.finalPoints == 0){
				game.view.set('zeroPointsReason', 'because you had more calories than points :( ');
			}

			game.view.set({
				diaEndEarly: true,
				diaEnd: false,
				finalScore: game.finalPoints,
				disease: game.diseaseHistory[game.diseaseHistory.length - 1][0].name,
				doctor: 'Patient has following heath issues:',
				disease1: game.diseaseHistory[0],
				disease2: game.diseaseHistory[1],
				disease3: game.diseaseHistory[2],
				disease4: game.diseaseHistory[3],
				disease5: game.diseaseHistory[4],
				disease6: game.diseaseHistory[5],
				disease7: game.diseaseHistory[6],
				disease8: game.diseaseHistory[7],
				disease9: game.diseaseHistory[8],
				disease10: game.diseaseHistory[9],
				upgrade1: game.upgradesList[0],
				upgrade2: game.upgradesList[1],
				upgrade3: game.upgradesList[2]				


			});
			game.scoreHistory.push(game.finalPoints);
			game.analyse(game.events);

		},	

		viewUpgrades: function( label ){

			if(label == 1){
			game.tempDate = new Date();
			game.view.set({
				upgrades: true
			});
			}else{
				game.readingTime +=Math.floor(((((new Date() - game.tempDate)/1000)/60)));
				game.view.set({
				upgrades: false
				});
			}
		},

		tooltip: function( a ){
			if(a == "return"){
				game.view.set({
					tooltips: false
				})
			} else {
				game.view.set({
					tooltips: true,
					a: true
				})
			}
		},

		viewCellTrophies: function( label ){

			if(label == 1){

			game.view.set({
				cellTrophies: true,
				cellTrophy2: game.cellList[1],
				cellTrophy3: game.cellList[2],
				cellTrophy4: game.cellList[3],
				cellTrophy5: game.cellList[4]

			});
			}else{
				game.view.set({
				cellTrophies: false
				});
			}
		},

		analyse : function ( array ) {
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
				(array[i].context.name) ? foodNumber ++ : exerciseNumber ++; 
			}

			//for now, game time = game turns

			//EAT RATE
			eatingRate = game.turns/foodNumber;

			//PREFERRED FOOD TYPES -for now average calorie intake

			averageCalories = game.calories/foodNumber;

			//CURSOR ACTIVITY
			//log as distance travelled

			for(var i = 0; i < array.length - 1; i++){
				var value = Math.sqrt(Math.pow( (array[i].pageX - array[i + 1].pageX) , 2) + Math.pow( (array[i].pageY - array[i + 1].pageY) , 2) );
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
			game.playerRatings = {
				eatingRate: eatingRate,
				averageCalories: averageCalories,
				foodNumber: foodNumber,
				cursorDistance: Math.floor(cursorDistance),
				caloriesBurned: caloriesBurned,
				exerciseRate: exerciseRate,
				scoreImprovement: scoreImprovement,
				exerciseNumber: exerciseNumber
			};

			return game.playerRatings;

		}

	};

	window.game = game; // for the debugging
	


		//get the food data
	get ('food.csv', function( csv ) {
		var parser = new CSVParser ( csv );
		game.food = parser.json();
	});

	get ('diseases.csv', function( csv ) {
		var parser = new CSVParser ( csv );
		game.diseaseList = parser.json();
	});

		get ('upgrades.csv', function( csv ) {
		var parser = new CSVParser ( csv );
		game.upgradesList = parser.json();
	});

		get ('cells.csv', function( csv ) {
		var parser = new CSVParser ( csv );
		game.cellList = parser.json();
	});




	// load template
	get( 'template.html', function ( template ) {
		game.render( template );
	});





	// helper functions
	function  get ( url, callback ) {
		var xhr = new XMLHttpRequest();

		xhr.open( 'get', url );
		xhr.onload = function () {
			callback( xhr.responseText )
		};

		xhr.send();
	}

	//shuffles array of creatures
	function shuffle ( array ) {
		var counter = array.length, temp, index;

		// While there are elements in the array
		while (counter--) {
			// Pick a random index
			index = (Math.random() * counter) | 0;

			// And swap the last element with it
			temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}

		return array;
	}



}());