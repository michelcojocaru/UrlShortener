/**
 * Created by michelcojocaru on 12/04/2018.
 */

// add an event listener to the shorten button for when the user clicks it
$('.btn-shorten').on('click', function(){
    // AJAX call to /api/shorten with the URL that the user entered in the input box
    $.ajax({
        url: '/',
        type: 'POST',
        dataType: 'JSON',
        data: {url: $('#url-field').val()},
        success: function(data){
            // display the shortened URL to the user that is returned by the server
            var resultHTML = '<a class="result" href="' + data.shortUrl + '">'
                + data.shortUrl + '</a>';
            $('#link').html(resultHTML);
            $('#link').hide().fadeIn('slow');
        }
    });

});

// add an event listener to the shorten button for when the user clicks it
$('.btn-get').on('click', function(){
    // AJAX call to /api/shorten with the URL that the user entered in the input box
    $.ajax({
        url: '/',
        type: 'POST',
        dataType: 'JSON',
        data: {url: $('#url-field').val(), method: "get"},
        success: function(data){
            // display the shortened URL to the user that is returned by the server
            var resultHTML = '<a class="result" href="' + data.shortUrl + '">'
                + data.shortUrl + '</a>';
            $('#link').html(resultHTML);
            $('#link').hide().fadeIn('slow');
        }
    });

});

// add an event listener to the shorten button for when the user clicks it
$('.btn-put').on('click', function(){
    // AJAX call to /api/shorten with the URL that the user entered in the input box
    $.ajax({
        url: '/',
        type: 'POST',
        dataType: 'JSON',
        data: {url: $('#url-field').val(), method: "put"},
        success: function(data){
            // display the shortened URL to the user that is returned by the server
            var resultHTML = '<a class="result" href="' + data.shortUrl + '">'
                + data.shortUrl + '</a>';
            $('#link').html(resultHTML);
            $('#link').hide().fadeIn('slow');
        }
    });

});

// add an event listener to the shorten button for when the user clicks it
$('.btn-post').on('click', function(){
    // AJAX call to /api/shorten with the URL that the user entered in the input box
    $.ajax({
        url: '/',
        type: 'POST',
        dataType: 'JSON',
        data: {url: $('#url-field').val(), method: "post"},
        success: function(data){
            // display the shortened URL to the user that is returned by the server
            var resultHTML = '<a class="result" href="' + data.shortUrl + '">'
                + data.shortUrl + '</a>';
            $('#link').html(resultHTML);
            $('#link').hide().fadeIn('slow');
        }
    });

});

// add an event listener to the shorten button for when the user clicks it
$('.btn-delete').on('click', function(){
    // AJAX call to /api/shorten with the URL that the user entered in the input box
    $.ajax({
        url: '/',
        type: 'POST',
        dataType: 'JSON',
        data: {url: $('#url-field').val(), method: "delete"},
        success: function(data){
            // display the shortened URL to the user that is returned by the server
            var resultHTML = '<a class="result" href="' + data.shortUrl + '">'
                + data.shortUrl + '</a>';
            $('#link').html(resultHTML);
            $('#link').hide().fadeIn('slow');
        }
    });

});