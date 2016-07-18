angular.module( 'tasks', ['ngAnimate'] );

angular.module( 'tasks' )
.controller( 'TasksCtrl', function ($scope) {

  /* Initial Application State */
  $scope.editingTask = null;
  $scope.viewCompleted = false;
  $scope.cameraActive = false;

  /* Initial list */
  $scope.tasks = [
	  {
		  title: 'Create a List',
		  description: 'Create my first list',
		  completed: true,
      picture: null
	  },
	  {
		  title: 'Complete list',
		  description: 'Add items to my list',
		  completed: false,
      picture: null
	  }
  ];
  
  
  /* Visible Tasks */
  $scope.isVisible = function ( index ) {
    if ( $scope.viewCompleted ) {
      return $scope.tasks[ index ].completed;
    }
    return !$scope.tasks[ index ].completed;
  }
  
  
  /* Toggle between Uncompleted and Completed Tasks */
  $scope.toggleView = function () {
    $scope.viewCompleted = !$scope.viewCompleted;
  }
  
  
  
  /* Creating a new Task */
  $scope.newTask = function () {
	  $scope.tasks.push({
		  title: 'New Task',
		  description: '',
		  completed: false,
      picture: null
	  })
    $scope.editTask( $scope.tasks.length - 1 );
  }
  
  
  /* Editing a Task */
  $scope.editTask = function ( index ) {
    $scope.editingIndex = index;
    $scope.editingTask = $scope.tasks[ index ];
  }


  /* Close Task */
  $scope.closeTask = function () {
    $scope.editingIndex = null;
    $scope.editingTask = null
    $scope.editTask__visible = false;
    
    // Also call save
    $scope.save();
  }


  /* Delete a Task */
  $scope.deleteTask = function () {
    // remove the task from our tasks array
    $scope.tasks.splice( $scope.editingIndex, 1);
    $scope.closeTask();
  }
  

  /* Take Picture */
  $scope.getPicture = function () {
    $scope.cameraActive = true;
    navigator.camera.getPicture(
      function ( pictureURI ) {
        $scope.cameraActive = false;
        $scope.editingTask.picture = 'data:image/jpeg;base64,' + pictureURI;
        $scope.$apply(); /* push change to model */
      },
      function ( err ) {
        $scope.cameraActive = false;
        //alert( 'Failed because: ' + err );
        $scope.$apply(); /* push change to model */
      },
      {
        quality: 50,
        targetWidth: 200,
        targetHeight: 200,
        saveToPhotoAlbum: false,
        encodingType: Camera.EncodingType.JPEG,
        destinationType: Camera.DestinationType.DATA_URL
      }
    );
  }


  /* Share Tasks */
  $scope.shareTasks = function () {
    var message = '';
    for ( var i = 0; i < $scope.tasks.length; i++ ) {
      if ( !$scope.tasks[ i ].completed ) {
        message += "☐ " + $scope.tasks[ i ].title + "%0A" + ($scope.tasks[ i ].description ? $scope.tasks[ i ].description + "%0A%0A" : "%0A");
      }
    }
    
    return message ? 'mailto:?subject=Tasks&body='+message : null;
  }


  /* Handle task completion */
  $scope.completeTask = function ( index ) {
    $scope.tasks[ index ].completed = !$scope.tasks[ index ].completed;
    $scope.save();
  }
  
  
  /* Back button pressed */
  $scope.backPressed = function () {
    if ( $scope.editingTask ) {
      $scope.closeTask();
      return false;
    }
  }


  /* Save application data */
  $scope.save = function () {
    localStorage.setItem( 'tasks', angular.toJson( $scope.tasks ) );
  }


  /* Load application data */
  $scope.load = function () {
    var tasks = angular.fromJson( localStorage.getItem( 'tasks' ) );
    if ( tasks ) {
      $scope.tasks = [];
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].title) {
          $scope.tasks.push(tasks[i]);
        }
      }
    }
  }
});

/* Non-angular functions */
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
  document.addEventListener("deviceready", onDeviceReady, false);
} else {
  onDeviceReady(); //this is the browser
}

function onDeviceReady() {

  // Fixing viewport for Windows Phone 8
  if (navigator.userAgent.match(/(IEMobile)/)) {
    console.log( '// Fixing viewport for Windows Phone 8' );
    var actionBars = document.querySelectorAll('.actions');
    for (var i = 0; i < actionBars.length; i++) {
      actionBars[ i ].style.top = (window.innerHeight - 80) + 'px';
      actionBars[ i ].style.bottom = 'auto';
    }
    document.body.style.height = window.innerHeight + 'px';
  }

  document.addEventListener( 'backbutton', function () {
    return angular.element( document.body ).scope().backPressed();
  }, false);

}
