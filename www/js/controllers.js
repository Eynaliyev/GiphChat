angular.module('gifchat.controllers', ['firebase'])
  .controller('AppCtrl', function(Auth, $scope, $ionicModal) {

    $ionicModal.fromTemplateUrl('templates/modals/profile.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.profileModal = modal;
    });

    $scope.openProfileModal = function(isFromCard) {
      $scope.isFromCard = isFromCard;
      $scope.profileModal.show();
    }
    $scope.closeProfileModal = function() {
      $scope.profileModal.hide();
    };

    $scope.interests = 'We will compare your Facebook interests  with those  of your matches to display  any  common connections'.split('  ');
  })    
    /*Edit Profile*/
  .controller('WelcomeCtrl', function(Auth, $state, $scope) {

    $scope.login = function() {
      console.log('Login cliked');
      
      return Auth.login().then(function(user) {
        $state.go('home.explore');
      });
    };
  })
  .controller('ExploreCtrl', function($firebaseArray, $scope, $ionicModal) {
    var ref = firebase.database().ref();
    var relationshipsRef = ref.child('relationships');
    var likesRef = relationshipsRef.child('likes');
    var dislikesRef = relationshipsRef.child('dislikes');
    //trying to get current user
    var user = firebase.auth().currentUser;
    //console.log(user);

    var payOrInviteClicked;
    $scope.payOrInviteClicked = false;

    $ionicModal.fromTemplateUrl('templates/modals/gift_energy.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.giftEnergyModal = modal;
    });

    $scope.openGiftEnergyModal = function() {
      $scope.giftEnergyModal.show();
    }
    $scope.closeGiftEnergyModal = function() {
      $scope.giftEnergyModal.hide();
    };
    // GifChat cards
    var cards = [
      {
        name: 'Max',
        age: 25,
        location: "San Francisco",
        stars: 4,
        uid: 1,
        image: "video/card1.gif"
      },
      {
        name: 'Beatrice',
        age: 40,
        location: "San Francisco",
        stars: 4.5,
        uid: 2,
        image: "video/card2.gif" 
      },
      {
        name: 'Maria',
        age: 28,
        location: "San Francisco",
        stars: 5,
        uid: 6,
        image: "video/card3.gif" 
      },
      {
        name: 'Betsy',
        age: 31,
        location: "San Francisco",
        stars: 3.5,
        uid: 7,
        image: "video/card4.gif" 
      },
      {
        name: 'Michelle',
        age: 22,
        location: "San Francisco",
        stars: 4,
        uid: 8,
        image: "video/card5.gif" 
      },
      {
        name: 'Penelope',
        age: 23,
        location: "San Francisco",
        stars: 5,
        uid: 9,
        image: "video/giphy2.gif" 
      },
      {
        name: 'Penelope',
        age: 19,
        location: "San Francisco",
        stars: 4,
        uid: 10,
        image: "video/giphy3.gif" 
      },
      {
        name: 'Patty',
        age: 19,
        location: "San Francisco",
        stars: 4,
        uid: 11,
        image: "video/giphy4.gif" 
      }
    ];
    var resetCards = angular.copy(cards);
    $scope.cards = [];

    function payOrInviteClick () {
      console.log("payOrInviteClicked: ");
      $scope.payOrInviteClicked = true;
      console.log("payOrInviteClicked: " + $scope.payOrInviteClicked);
    }

    function _addCards(quantity) {
      for (var i = 0; i < Math.min(cards.length, quantity); i++) {
        $scope.cards.push(cards[0]);
        cards.splice(0, 1);
      }
    }
    
    $scope.cardDestroyed = function(index) {
      console.log(index);
      $scope.cards.splice(index, 1);
      _addCards(1);
      $scope.isMoveLeft = false;
      $scope.isMoveRight = false;
    };

    $scope.cardSwiped = function(index) {
      $scope.cards.push(cards[Math.floor(Math.random(1)*8)]);
    };

    // For reasons, the cardSwipedRight and cardSwipedLeft events don’t get called always
    // https://devdactic.com/optimize-tinder-cards/
    $scope.cardSwipedLeft = function(event, index) {
      console.log($scope.cards[index], 'NOPE');
      var dislike = {
        from: user.uid,
        to: $scope.cards[index].uid
      };
      return $firebaseArray(dislikesRef).$add(dislike);
      event.stopPropagation();
    }

    $scope.cardSwipedRight = function(event, index) {
      console.log($scope.cards[index], 'LIKE');
      var like = {
        from: user.uid,
        to: $scope.cards[index].uid
      };
      return $firebaseArray(likesRef).$add(like);


      event.stopPropagation();

      // Open Match popup
      if (cards.length % 3 == 1) $scope.openMatchModal();
    }

    $scope.cardPartialSwipe = function(amt) {
      $scope.isMoveLeft = amt < -0.15;
      $scope.isMoveRight = amt > 0.15;  
    }

    $scope.reset = function() {
      cards = angular.copy(resetCards);
      _addCards(2);
    }

    // Match popup
    $ionicModal.fromTemplateUrl('templates/modals/match.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.matchModal = modal;
    });

    $scope.openMatchModal = function(isFromCard) {
      $scope.matchModal.show();
    }
    $scope.closeMatchModal = function() {
      $scope.matchModal.hide();
    };

    // Onload
    _addCards(2);// 2 is the best choice for the performance
  })

  .controller('SettingsCtrl', function(Auth, $scope, $ionicModal) {
    $scope.currentUser = Auth.currentUser;
    console.log($scope.currentUser);

    $ionicModal.fromTemplateUrl('templates/modals/settings.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalSettings = modal;
    });
    $scope.openSettingsModal = function() {
      $scope.modalSettings.show();
      $scope.logout = function() {
        // angularfire sign out function from github docs
        $scope.modalSettings.hide();
        Auth.logout();
      };
    };
    $scope.closeSettingsModal = function() {
      $scope.modalSettings.hide();
    };

    $ionicModal.fromTemplateUrl('templates/modals/profile_edit.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.editProfileModal = modal;
    });

    $scope.openEditProfileModal = function() {
      $scope.editProfileModal.show();
    };
    $scope.closeEditProfileModal = function() {
      $scope.editProfileModal.hide();
    };
  })

  .controller('MatchesCtrl', function($scope) {
    $scope.matches = [
      {
        name: 'Beatrice',
        isNew: true
      },
      {
        name: 'Maria',
        isNew: true
      },
      {
        name: 'Patty',
        isNew: false
      },
      {
        name: 'Max',
        isNew: false
      },
      {
        name: 'Betsy',
        isNew: false
      },
      {
        name: 'Michelle',
        isNew: false
      }
    ]
  })

  // Inspired by Elastichat http://codepen.io/rossmartin/pen/XJmpQr
  .controller('MessagingCtrl', function($scope, $stateParams, Giphy, $ionicScrollDelegate, $timeout, $ionicActionSheet) {
    $scope.isNew = $stateParams.id < 2;
    $scope.gifs = [];
    $scope.gifQuery = '';
    $scope.isGifShown = false;
    $scope.isGifLoading = false;
    $scope.questions = [
      {
        question: "Usual week-end night?",
        option1: "Go to the bars",
        option2: "Read a book at home"
      },
      {
        question: "Which do you like more?",
        option1: "Tea",
        option2: "Coffee"
      },
      {
        question: "Favorite Food",
        option1: "Healthy Food",
        option2: "Taste before health! You Only live once!"
      }
    ];
    $scope.messages = [
      {
        isMe: true,
        type: 'image',// text || image
        body: 'img/hello.gif',
        timestamp: 'Feb 26, 2016, 9:47PM'
      },
      {
        isMe: false,
        avatar: 'img/adam.jpg',
        type: 'image',// text || image
        body: 'img/hello.gif',
        timestamp: 'Feb 26, 2016, 9:47PM'
      },
      {
        isMe: true,
        type: 'text',// text || image
        body: 'Where are you, buddy?',
        timestamp: 'Feb 26, 2016, 9:47PM'
      },
      {
        isMe: false,
        avatar: 'img/adam.jpg',
        type: 'text',// text || image
        body: 'I\'m almost there',
        timestamp: 'Feb 26, 2016, 9:47PM'
      }
    ];

    $scope.message = '';
    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

    $scope.sendText = function() {
      $scope.messages.push({
        isMe: true,
        type: 'text',
        body: $scope.message,
        timestamp: 'Feb 26, 2016, 9:47PM'
      });
      $scope.message = '';
      _scrollBottom();
      $scope.fakeReply();
    }

    $scope.sendGif = function(imageUrl) {
      console.log(imageUrl);
      $scope.messages.push({
        isMe: true,
        type: 'image',
        body: imageUrl
      });
      $scope.message = '';
      _scrollBottom('#type-area2');
      $scope.fakeReply();
    }

    $scope.fakeReply = function() {
      $timeout(function() {
        $scope.messages.push({
        isMe: false,
        avatar: 'img/adam.jpg',
        type: 'text',
        body: 'Keep typing dude',
        timestamp: 'Feb 26, 2016, 9:47PM'
      });
      $scope.message = '';
      _scrollBottom();
      }, 500)
    }

    $scope.openGiphy = function() {
      $scope.isGifShown = true;
      $scope.message = '';
    }

    var _scrollBottom = function(target) {
      target = target || '#type-area';

      viewScroll.scrollBottom(true);
      _keepKeyboardOpen(target);
      if ($scope.isNew) $scope.isNew = false;
    }

    // Warning: Demo purpose only. Stay away from DOM manipulating like this
    var _keepKeyboardOpen = function(target) {
      target = target || '#type-area';

      txtInput = angular.element(document.body.querySelector(target));
      console.log('keepKeyboardOpen ' + target);
      txtInput.one('blur', function() {
        console.log('textarea blur, focus back on it');
        txtInput[0].focus();
      });
    }

    $scope.$watch('gifQuery', function(newValue) {
      if (newValue.length) {
        $scope.isGifLoading = true;
        $scope.gifs = [];

        Giphy.search(newValue)
          .then(function(gifs) {
            $scope.gifs = gifs;
            $scope.isGifLoading = false;
          })
      } else {
        _initGiphy();
      }
    });

    // Show the action sheet
    $scope.showUserOptions = function() {
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Mute Notifications' },
          { text: 'Unmatch Max' },
          { text: 'Report Max' },
          { text: 'Show Max\'s profile' }
        ],
        cancelText: 'Cancel',
        cancel: function() {
            // add cancel code..
          },
        buttonClicked: function(index) {
          return true;
        }
      });
    }

    // Onload
    var _initGiphy = function() {
      Giphy.trending()
        .then(function(gifs) {
          $scope.gifs = gifs;
        });
    }
    _initGiphy();
  })
