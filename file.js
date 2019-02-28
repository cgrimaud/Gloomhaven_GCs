var user = null;

// array of objects that defines navbar buttons/links
var navbar = [
    {
        text: "Login",
        func: function (){
            $('#loginModal').modal('show');
        },
        id: "login",
        classes: "btn btn-outline-success my-2 my-sm-0",
        type: "button"
    },
    {
        text: "Log out",
        func: signOut,
        id: "logout",
        classes: "btn btn-outline-success my-2 my-sm-0",
        type: "button"
    },
    {
        text: "Campaign",
        href: "./campaign",
        id: "campaignLink",
        classes: "",
        type: "a"
    },
    {
        text: "Party Sheet",
        href: "./partysheet",
        id: "partySheetLink",
        classes: "",
        type: "a"
    },
    {
        text: "Characters",
        href: "./characters",
        id: "charactersLink",
        classes: "",
        type: "a"
    }
]

// loops through navbar array and dynamically creates buttons or links
function createNavbar (){
    navbar.forEach(function(item){
        createNavbarElement(item)
    })
}

// creates navbar elements based on the properties of the navbar element
function createNavbarElement (item){
    var text = item.text;
    var func = item.func;
    var id = item.id;
    var classes = item.classes;
    var type = item.type;
    var href = item.href;

    var element = ' <' + type + ' class="' + classes + '" id="' + id + '">' + text + '</' + type + '>';

    // appends navbar element to Navbar in HTML
    $('#navbar').append(element);
    // if element as func property, add click event
     if (func){
        $('#' + id).click(func);
     }
     // if element has property type of button, adds button attribute to object
     if (type === "button"){
        $('#' + id).attr("type", "button")
     }
     // if element has href property, adds href attribute to object
     if (href){
         $('#' + id).attr("href", href)
     }
    
}

// call createNavbar function
createNavbar();

// changes btn-primary text based on click
$(".btn-primary").click(function () {
    $(this).text(function (text) {
        return text === "Hide the Party Members" ? "See the Party Members" : "Hide the Party Members";
    })
});

    // Register event handler for the submit action of the login form
$("#loginForm").on('submit', handleLoginFormSubmit)

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


var database = firebase.database();
var usersRef = database.ref('users/');

usersRef.on('value', handleUsersUpdate);

function handleUsersUpdate(snapshot){
    // snapshot is the object that is returned from firebase
    // calling .val() method on the snapshot returns the values from teh database as a javascript object
    var usersObject = snapshot.val();
    // snapshot.val() returns the keys as they are in the database (string or numerical)
    // we want data to be an array so that it's iterable. 
    // create an array out of the snapshots values using Object.values
    var usersArray = Object.values(usersObject);
    
    buildCharacterCards(usersArray);
}

// dynamically builds character card deck 
function buildCharacterCards(users){
    // empty party element so changes made to character info do not cause duplicate cards
    $('#party').empty();
    // loops through the users array 
    users.forEach(function(user){
        // loops through user's characters, then builds cards and modals 
        user.characters.forEach(function(character){
            buildCharacterCard(character);
            buildCharacterModal(character);
        })
    })
}

// builds cards based on character properties  
function buildCharacterCard(character){
    var characterClass = character.class;
    var description = character.description;
    var image = character.image;
    var level = character.level;
    var motto = character.motto;
    var name = character.name;
    var title = character.title;

// builds character card
  var card = '<div class="card">' + 
                '<img class="card-img-top" src="' + image + '" alt="' + title + '">' +
                '<div class="card-body text-center">' +
                    '<h5>' + name + '</h5>' +
                    '<p class="card-text">' + title + '</p>' +
                    '<a data-toggle="modal" href="#' + name + 'Modal" class="card-link">Learn about ' + name + '</a>' +
                '</div>' +
            '</div>';

    // appends character card to party card deck in HTML
     $('#party').append(card);
}

// builds modals based on character properties  
function buildCharacterModal(character){
    var characterClass = character.class;
    var descriptions = character.description;
    var image = character.image;
    var level = character.level;
    var motto = character.motto;
    var name = character.name;
    var title = character.title;

// builds modal 
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
                        // loops through character description, and dynamically adds paragraphs for each description
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

     // appends modal to party card deck in HTML           
     $('#party').append(modal);
}

    