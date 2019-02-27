var user = null;

$(document).ready(function () {
    $(function () {
        $(".btn-primary").click(function () {
            $(this).text(function (text) {
                return text === "Hide the Party Members" ? "See the Party Members" : "Hide the Party Members";
            })
        });
    })

    // Register event handler for the submit action of the login form
    $("#loginForm").on('submit', handleLoginFormSubmit)
});


// This is an observable added by firebase
// Here we are registering functions to be called on the 'onAuthStateChanged' event of firebase.auth
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0#onAuthStateChanged
firebase.auth().onAuthStateChanged(function (user) {
    // New user value
    // if null then user has logged out
    this.user = user;
    console.log('User value has changed!', user);
    if (user) {
        // User is signed in.
        alert('You are logged in to ' + user.email + "!");

        $('#loginModal').modal('hide')

        /* TODO show logged in ui */
        $("#login").hide();
        $("#logout").show();
    } else {
        // No user is signed in.
        /* TODO hided logged in ui / show logged out ui */
        $("#login").show();
        $("#logout").hide();
    }
});

function handleLoginFormSubmit($event) {
    // This prevents the forms submit action from reloading the page/calling the action
    $event.preventDefault();

    // Getting form values
    var emailInput = $("#loginForm input[name=email]");
    var email = emailInput.val();
    var passwordInput = $("#loginForm input[name=password]");
    var password = passwordInput.val();

    // Calling function to login with provided values
    signInWithEmailAndPassword(email, password);
}

function signInWithEmailAndPassword(email, password) {
    // Firebase sign in with email and password
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0#isSignInWithEmailLink
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
            // logged in
            // Here we could handle any logic we need with the new user value that is returned
            // Instead we are letting the event handler we registered for firebase's 'onAuthStateChanged' to handle it
        })
        .catch(function (error) {
            // Handle login errors here
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Failed to log in', error);
            alert(errorMessage);
        });
}

function signOut() {
    // Signs the user out
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0#signOut
    firebase.auth().signOut();
}

$("#logout").on("click", signOut);

var database = firebase.database();
var usersRef = database.ref('users/');

usersRef.on('value', handleUsersUpdate);

function handleUsersUpdate(snapshot){
    console.log('database snapshot', snapshot.val());
    var users = Object.values(snapshot.val());
    buildCharacterCards(users);
}

function buildCharacterCards(users){
    $('#party').empty();
    users.forEach(function(user){
        user.characters.forEach(function(character){
            buildCharacterCard(character);
            buildCharacterModal(character);
        })
    })
}

function buildCharacterCard(character){
    var characterClass = character.class;
    var description = character.description;
    var image = character.image;
    var level = character.level;
    var motto = character.motto;
    var name = character.name;
    var title = character.title;

  var card = '<div class="card">' + 
                '<img class="card-img-top" src="' + image + '" alt="' + title + '">' +
                '<div class="card-body text-center">' +
                    '<h5>' + name + '</h5>' +
                    '<p class="card-text">' + title + '</p>' +
                    '<a data-toggle="modal" href="#' + name + 'Modal" class="card-link">Learn about ' + name + '</a>' +
                '</div>' +
            '</div>';

     $('#party').append(card);
}

function buildCharacterModal(character){
    var characterClass = character.class;
    var descriptions = character.description;
    var image = character.image;
    var level = character.level;
    var motto = character.motto;
    var name = character.name;
    var title = character.title;

  var modal = '<div class="modal fade" id="' + name + 'Modal" tabindex="-1" role="dialog" aria-labelledby="modalCenterTitle" aria-hidden="true">' +
                '<div class="modal-dialog modal-dialog-centered" role="document">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<h5 class="modal-title">' + title + '</h5>' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                                '<span aria-hidden="true">&times;</span>' +
                            '</button>' +
                        '</div>' +
                        '<div class="modal-body">';
                            descriptions.forEach(function(description){
                                modal += '<p>' + description + '</p>'
                            })
                
                        modal += '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '</div>';

     $('#party').append(modal);
}

    