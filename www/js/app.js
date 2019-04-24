angular.module('todo', ['ionic'])

.controller('TodoCtrl', function($scope, $http, $ionicModal, $ionicSideMenuDelegate) {
  
  
  //LES VARIABLES
  $scope.tasks = {};
  $scope.auth = {};
  $scope.utilisateur = {};
  $scope.ins = {};
  $scope.response = {};
  $scope.new = {};
  $scope.collab = {};
  $scope.newtask = {};
  $scope.projects = {}; 
  $scope.projetselected = {}; 
  $scope.modification=false;



  //MODALS IONIC - INITIALISATION 


  //MODAL D'INSCRIPTION 
  $ionicModal.fromTemplateUrl('inscrire.html', function(modal) {
    $scope.insModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    //Interdire la sortie du modal
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  });


  //MODAL DE CONNEXION 
  $ionicModal.fromTemplateUrl('connect.html', function(modal) {
    $scope.authModal = modal;
    //Ouverture automatique dès le lancement de l'application
    $scope.authModal.show();
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    //Interdire la sortie du modal
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  });


  //MODAL DE NOUVELLE TÂCHE 
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });  


  //MODAL DE NOUVELLE LISTE 
  $ionicModal.fromTemplateUrl('new-list.html', function(modal) {
    $scope.listModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  }); 


  //MODAL D'EDITION DE LISTE 
  $ionicModal.fromTemplateUrl('edit-list.html', function(modal) {
    $scope.editlistModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  }); 


  //MODAL DE SUPPRESSION DE LISTE 
  $ionicModal.fromTemplateUrl('delete-list.html', function(modal) {
    $scope.deleteModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }); 
  



  //LISTES DES FONCTIONS DU CONTRÔLEUR


  //FONCTION D'INSCRIPTION
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



  //FONCTION D'AUTHENTIFICATION  
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



  //FONCTION DE CREATION DE LISTE  
  $scope.createList = function(liste) {
    if(liste!=undefined) {
      if(liste.hasOwnProperty("name") && liste.hasOwnProperty("description")){
        $scope.response.text4 = '';
        $scope.new.name = liste.name;
        $scope.new.description = liste.description;
        $http.post('/api/laliste/create/'+$scope.utilisateur.id, $scope.new)
        .success(function(data) {
          $http.get('/mobile/'+$scope.utilisateur.id)
          .success(function(data) {
            $scope.projects=data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        }); 
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
        $scope.listModal.hide();
      }else{
        $scope.response.color = 'red';
        $scope.response.text4 = 'Certains champs ne sont pas complétés !';
      };
    }else{
      $scope.response.color = 'red';
      $scope.response.text4 = 'Ecrire une liste avant de la soumettre !';
    };
  };



  //FONCTION D'EDITION DE LISTE  
  $scope.editList = function(projetselected) {
    if(projetselected!=undefined) {
      if(projetselected.hasOwnProperty("name") && projetselected.hasOwnProperty("description")){
        if(projetselected.name!="" && projetselected.description!=""){
          $scope.response.text5 = '';
          $http.post('/api/laliste/edit/'+$scope.projetselected._id, $scope.projetselected)
          .success(function(data) {
            $http.get('/mobile/'+$scope.utilisateur.id)
            .success(function(data) {
              $scope.projects=data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          }); 
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
          $scope.editlistModal.hide();
        }else{
          $scope.response.color = 'red';
          $scope.response.text5 = 'Certains champs sont vides !';
        };
      }else{
        $scope.response.color = 'red';
        $scope.response.text5 = 'Certains champs sont vides !';
      };
    }else{
      $scope.response.color = 'red';
      $scope.response.text5 = 'Certains champs sont vides !';
    };
  };



  //FONCTION DE SUPPRESSION DE LISTE  
  $scope.deleteList = function() {  
    $http.delete('/api/laliste/mdelete/'+$scope.projetselected._id)
    .success(function(data) {
      $http.get('/mobile/'+$scope.utilisateur.id)
      .success(function(data) {
        $scope.projects=data;
        $scope.deleteModal.hide();
    })
    .error(function(data) {
        console.log('Error: ' + data);
    }); 
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });   
  };



  //FONCTION DE CREATION DE COLLABORATION  
  $scope.createCollab = function() {
    $scope.collab.list_id= $scope.projetselected._id;
    $http.post('collabList', $scope.collab)
      .success(function(result) {
        console.log(result.toString())
        if (result.toString()=="false"){
          $scope.response.color='red';
          $scope.response.text6="Collaboration échouée, pas d'utilisateur "+$scope.collab.name+" trouvé.";
        } else {
          $http.get('/mobile/'+$scope.utilisateur.id)
          .success(function(data) {
            $scope.projects=data;
            $scope.projetselected.name=$scope.projects.listes[$scope.projetselected.index].name;
            $scope.projetselected.description=$scope.projects.listes[$scope.projetselected.index].description;
            $scope.projetselected._id=$scope.projects.listes[$scope.projetselected.index]._id;
            $scope.projetselected.collaboraters=$scope.projects.listes[$scope.projetselected.index].collaboraters;
          })
          .error(function(data) {
            console.log('Error: ' + data);
          }); 
          $scope.response.color='green';
          $scope.response.text6="Collaboration avec "+$scope.collab.name+" créee.";

        }
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });
  };



  //FONCTION DE SUPPRESSION DE COLLABORATION  
  $scope.deleteCollab = function(index) {
    $scope.collab.list_id= $scope.projetselected._id;
    $scope.collab.lequel= index;
    $scope.collab.liste=$scope.projetselected.collaboraters;
    console.log($scope.collab);
    $http.post('decollabList', $scope.collab)
    .success(function(result) {
      $http.get('/mobile/'+$scope.utilisateur.id)
      .success(function(data) {
        $scope.projects=data;
        $scope.projetselected.name=$scope.projects.listes[$scope.projetselected.index].name;
        $scope.projetselected.description=$scope.projects.listes[$scope.projetselected.index].description;
        $scope.projetselected._id=$scope.projects.listes[$scope.projetselected.index]._id;
        $scope.projetselected.collaboraters=$scope.projects.listes[$scope.projetselected.index].collaboraters;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      }); 
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
  };




  //FONCTION DE DECOLLABORATION
  $scope.jeveuxplus = function (project) {
    $scope.projetselected.liste_id=project._id;
    $scope.projetselected.user_id=$scope.utilisateur.id;
    $http.post('/veuxplus', $scope.projetselected)
    .success(function(result) {
      $http.get('/mobile/'+$scope.utilisateur.id)
      .success(function(data) {
        $scope.projects=data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      }); 
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
  };




  //FONCTION D'AJOUT DE TÂCHE
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




  //FONCTION DE MODIFICATION DE TÂCHE
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



  //FONCTION DE RETOUR A L'AFFICHAGE NORMAL DE LA TÂCHE
  $scope.retour = function() {
    for (pas = 0; pas < $scope.tasks.tasks.length; pas++) {
      document.getElementById('task-'+pas).style.display = "block";
      document.getElementById('input-'+pas).style.display = "none";
    };
  };




  //FONCTION DE VERIFICATION DE LA TÂCHE 
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




  //FONCTION DE SUPPRESSION DE TÂCHE
  $scope.deleteTask = function(id) {
    $http.delete('/api/laliste/'+$scope.tasks._id+'/'+id)
    .success(function(data) {
        $scope.tasks = data;
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
  };




  //FONCTION DE SUPPRESSION DE TOUTES LES TÂCHES
  $scope.deleteAll = function() {
    $http.delete('/api/laliste/'+$scope.tasks._id)
    .success(function(data) {
        $scope.tasks = data;
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
  };




  //FONCTION POUR AFFICHAGE D'ARRIERE PLAN POUR L'ECRAN DE CONNEXION
  $http.get('/getTaskSet')
      .success(function(data) {
          $scope.tasks = data;
      })
      .error(function(data) {
          console.log('Error: ' + data);
      });




  //FONCTIONS POUR L'AFFICHAGE ET LA FERMETURE DES MODALS

  $scope.inscription = function() {
    $scope.authModal.hide();
    $scope.insModal.show();
  };   

  $scope.newTask = function() {
    $scope.response.text3 = '';
    $scope.newtask.name = "";
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
    $scope.response.text3 = '';
  };

  $scope.creationdeliste = function() {
    $scope.listModal.show();
  }

  $scope.fermeturedeliste = function() {
    $scope.listModal.hide();
  } 
  
  $scope.creationeditiondeliste = function(project, index) {
    $scope.projetselected.index=index;
    $scope.projetselected.name=project.name;
    $scope.projetselected.description=project.description;
    $scope.projetselected._id=project._id;
    $scope.projetselected.collaboraters=project.collaboraters;
    $scope.editlistModal.show();
  }

  $scope.fermetureeditiondeliste = function() {
    $scope.editlistModal.hide();
  }

  $scope.confirmationsuppressiondeliste = function() {
    $scope.editlistModal.hide();
    $scope.deleteModal.show();
  }

  $scope.fermeturedeconfirmationsuppressiondeliste = function() {
    $scope.deleteModal.hide();
    $scope.editlistModal.show();
  }

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.selectProject = function(project, index) {
    $scope.tasks = project;
    $ionicSideMenuDelegate.toggleLeft(false);
  };

})



//FONCTIONS JAVASCRIPT

//RECUPERATION D'UN COOKIE
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  console.log('je te fais un cookie');
}

