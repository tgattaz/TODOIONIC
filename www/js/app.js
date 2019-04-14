angular.module('todo', ['ionic'])

.controller('TodoCtrl', function($scope, $http, $ionicModal, $ionicSideMenuDelegate) {
  $scope.tasks = {};
  $scope.auth = {};
  $scope.utilisateur = {};
  $scope.ins = {};
  $scope.response = {};
  $scope.new = {};
  $scope.projects = {};  
  $scope.modification=false;

  $http.get('/getTaskSet')
      .success(function(data) {
          $scope.tasks = data;
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });  
  
  // Create and load the Modal
  $ionicModal.fromTemplateUrl('connect.html', function(modal) {
    $scope.authModal = modal;
    $scope.authModal.show();
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  });

  $ionicModal.fromTemplateUrl('inscrire.html', function(modal) {
    $scope.insModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  });

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.selectProject = function(project, index) {
    $scope.tasks = project;
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  $scope.createTask = function(task) {
    if(task!=undefined) {
      if(task.name!=""){
        if($scope.tasks!=undefined) {
          $scope.response.text3 = '';
          $scope.new.text = task.name;
          $scope.new.creator = $scope.utilisateur.username;
          $http.post('/api/laliste/'+$scope.tasks._id, $scope.new)
            .success(function(data) {
                $scope.tasks = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      
          $scope.taskModal.hide();
        }
        else {
          $scope.response.color = 'red';
          $scope.response.text3 = "Choisir d'abord la liste où ajouter votre tâche !";
          setTimeout(function(){
            $scope.taskModal.hide();
          }, 1000);      
        };
      }else{
        $scope.response.color = 'red';
        $scope.response.text3 = 'Ecrire une tâche avant de la soumettre !';
      };
    } else {
      $scope.response.color = 'red';
      $scope.response.text3 = 'Ecrire une tâche avant de la soumettre !';
    };
  };

  $scope.inscrire = function(user) {
    if(user!=undefined){
      if(user.hasOwnProperty("username") && user.hasOwnProperty("password") && user.hasOwnProperty("passwordconf")){
        $scope.ins.username = user.username;
        $scope.ins.password = user.password;
        $scope.ins.passwordconf = user.passwordconf;
        if($scope.ins.password==$scope.ins.passwordconf){
          $http.post('/newUser', $scope.ins)
          .success(function(data) {
              $scope.ins = {}; 
              $scope.response.color = 'green';
              $scope.response.text2 = 'Inscription complétée, merci !';   

              setTimeout(function(){
                $scope.insModal.hide();
                $scope.authModal.show();
              }, 2000);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
        }else{
          $scope.response.color = 'red';
          $scope.response.text2 = 'Erreur les deux mots de passe ne correspondent pas !';
        }
      }else{
        $scope.response.color = 'red';
        $scope.response.text2 = 'Certains champs ne sont pas complétés !';      
      };
    }else{
      $scope.response.color = 'red';
      $scope.response.text2 = 'Certains champs ne sont pas complétés !';      
    };
  };

  // Called when the form is submitted
  $scope.authentification = function(user) {
    if(user!=undefined){
      if(user.hasOwnProperty("username") && user.hasOwnProperty("password")){
        $scope.auth.username = user.username;
        $scope.auth.password = user.password;
        $http.post('/connectUser', $scope.auth)
        .success(function(data) {
          $scope.response.text = data;
          if (data!="Utilisateur non trouvé ou mot de passe incorrect" && data!="Tu as atteints la limite d'essais de connexion"){
              document.getElementById("lechat").src="img/cat4.png";
              $scope.response.text = 'Bonjour ' + $scope.auth.username + ' ! Redirection sur votre espace en cours ...';
              setCookie('username', $scope.auth.username, 0.01);
              $scope.utilisateur.username = $scope.auth.username;
              $scope.auth = {};
              $scope.response.color = 'green';
              $scope.utilisateur.id = data.replace(/^"(.*)"$/, '$1');
              $http.get('/mobile/'+$scope.utilisateur.id)
                  .success(function(data) {
                    $scope.projects=data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                }); 
  
              
              setTimeout(function(){
                $scope.authModal.hide();
                delete $scope.tasks;
              }, 2000);
          } else {
              document.getElementById("lechat").src="img/cat6.png";
              $scope.response.color = 'red';
          };
      })
        .error(function(data) {
            console.log('Error: ' + data);
        });
      }else{
        document.getElementById("lechat").src="img/cat5.png";
        $scope.response.text = "Ils manquent certains champs";
        $scope.response.color = 'red';
      };
    }else{
      document.getElementById("lechat").src="img/cat5.png";
      $scope.response.text = "Ils manquent certains champs";
      $scope.response.color = 'red';
    };


  };

  $scope.inscription = function() {
    $scope.authModal.hide();
    $scope.insModal.show();
  }

  $scope.deleteTask = function(id) {
      $http.delete('/api/laliste/'+$scope.tasks._id+'/'+id)
      .success(function(data) {
          $scope.tasks = data;
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });
    };

  $scope.retour = function() {
    for (pas = 0; pas < $scope.tasks.tasks.length; pas++) {
      document.getElementById('task-'+pas).style.display = "block";
      document.getElementById('input-'+pas).style.display = "none";
    };
  };

  $scope.modifyTask = function(index, task) {
    if($scope.modification==false){
      console.log('tu fais une modification');
      $scope.new.text=task.text;
      $scope.new._id=task._id;
      $scope.modification=true;
      document.getElementById('task-'+index).style.display = "none";
      document.getElementById('input-'+index).style.display = "block";
    }else{
      if($scope.new._id==task._id){
        $http.post('/api/laliste/'+$scope.tasks._id+'/'+task._id, $scope.new)
        .success(function(data) {
            $scope.tasks = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        }); 
      };
      console.log('tu as fini ta modification');
      $scope.modification=false;
      for (pas = 0; pas < $scope.tasks.tasks.length; pas++) {
        document.getElementById('task-'+pas).style.display = "block";
        document.getElementById('input-'+pas).style.display = "none";
      };
    }

  };

  $scope.isChecked = function(index, task) {
    $scope.new.checked = document.getElementById('done-'+index).checked;
    $http.post('/api/laliste/done/'+$scope.tasks._id+'/'+task._id, $scope.new)
    .success(function(data) {
        $scope.tasks = data;
    })
    .error(function(data) {
        console.log('Error: ' + data);
    }); 
  };

  // Open our new task modal
  $scope.newTask = function() {
    $scope.response.text3 = '';
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
    $scope.response.text3 = '';
  };

})

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  console.log('je te fais un cookie');
}

