'use strict';
/**
 *
 */

(function() {


var appCommand = angular.module('uploadmonitor', ['googlechart', 'ui.bootstrap', 'ngUpload']);






// --------------------------------------------------------------------------
//
// Controler Ping
//
// --------------------------------------------------------------------------

// Ping the server
appCommand.controller('UploadControler',
	function ( $http, $scope, $element ) {


	this.caseid='6001';
	this.docname='invoiceLetter';
	this.localfile='';
	this.temporaryname='';
	this.contentType='';
	this.filename='New doc ';
	this.uploadstatus='';
	this.assignstatus='';

	/*
	var form = $element.find('form');
	var input = $element.find('input');

	input.on('change', function(event) {
			console.log('forceSubmit: ' + event);
			if(!event.target.value) {
				return;
			}

			form.triggerHandler('submit');
			form[0].submit();
		});

	$scope.$on('$destroy', function() {
    input.off('change', forceSubmit);
  });
	*/
  
	this.Upload = function()
	{
		var self=this;
		this.uploadstatus="Preparation...";
		var data={};
		var form = $element.find('form');
		var input = $element.find('input');
		form.triggerHandler('submit');
		form[0].submit();
	
	/*
		$http.post( '/bonita/API/formFileUpload', data )
				.success( function ( jsonResult ) {
						self.uploadstatus 		= "Post with sucess, upload in progress..";
						self.temporaryname 		= jsonResult.data.tempPath;
						self.filename 			= jsonResult.data.filename;
				})
				.error( function() {
						alert('an error occure');
						self.uploadstatus 		= "error";
					});

	*/
	}



	this.uploadComplete = function(response) {
		var self=this;
		self.uploadstatus ="File uploaded with name ["+response.tempPath+"]";
		// alert("response="+angular.toJson(response));
		self.temporaryname = response.tempPath;
		//self.fileName = response.filename;
		self.contentType = response.contentType;
	}

	this.Assign = function()
	{
		var paramBody = {};
		var self=this;
		paramBody.caseId= this.caseid;
		paramBody.file= this.temporaryname;
		paramBody.name= this.docname;
		paramBody.fileName= this.filename;
		paramBody.contentType = this.contentType;
		paramBody.description="The File description";
		self.assignstatus ='assignement in progress...';	
		$http({ url: '/bonita/API/bpm/caseDocument', method:"POST", data: paramBody } )
				.then( function ( jsonResult ) {
					self.assignstatus 		= "Assign with success, contentStorageId="+jsonResult.data.contentStorageId;
					},
					function( jsonResult) {
						// error ! We can't get the error code, so we assume this is a AlreadyExist error
						// alert('an error occure: '+angular.toJson(jsonResult));
						self.assignstatus = self.assignstatus + ";Already exist. Search documentId...";
						$http({ url: '/bonita/API/bpm/caseDocument?p=0&c=10&f=name='+self.docname+'&f=caseId='+self.caseid, method:"GET"} )
							.then( 
								function ( jsonResult ) {
								// ok, do the update now
								var documentId = jsonResult.data[0].id;
								self.assignstatus = self.assignstatus + ";Document["+documentId+"] found, update it...";

								// alert('Correct search, answer='+angular.toJson(jsonResult));
								$http({ url: '/bonita/API/bpm/caseDocument/'+documentId, method:"PUT", data: paramBody } )
									.then( function ( jsonResult ) {
										// alert('Correct search, answer='+angular.toJson(jsonResult));
										self.assignstatus 		= self.assignstatus +";Document updated.";
										},
										function( jsonResult) {
											self.assignstatus 		= self.assignstatus + "error on update "+angular.toJson(jsonResult);
											alert("Error on update "+angular.toJson(jsonResult));
										})
									},
								// search error
								function( jsonResult) {
										self.assignstatus 		= self.assignstatus + "error on Search "+angular.toJson(jsonResult);
										alert("Error on update "+angular.toJson(jsonResult));
									})
				});
	};


	this.infoList=[];
	this.infoCaseId='';
	this.getInfo = function() {
		var self=this;
		self.infoDoc ="get info on caseid "+self.infoCaseId+"...";
		$http({ url: '/bonita/API/bpm/caseDocument?p=0&c=10&f=caseId='+self.infoCaseId, method:"GET"} )
		.then( 	function ( jsonResult ) {
			self.infoList= jsonResult.data;
			self.infoDoc = self.infoDoc+";Success ";
			},
			function ( jsonResult ) {
			self.infoDoc = self.infoDoc+"; error "+angular.toJson(jsonResult);
			}
			);
	}
	
});



})();
