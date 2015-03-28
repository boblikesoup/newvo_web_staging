angular.module('app', [
	'ui.router',
	'ngAnimate', 
	'parse-angular',
	'parse-angular.enhance',

	/* models */
	'brandid.models.Monsters',

	/* states */ 
	'brandid.states.features', 
	'brandid.states.facebook', 
	'brandid.states.demo' , 
	'brandid.states.about', 
	
	'brandid.directives.forms' /* an example directive */, 	
	
	'ParseServices' /* this is the Parse SDK */, 

	'FacebookPatch' /* our facebook angular wrapper so we can use FB.apiAngular instead of FB.api */
])