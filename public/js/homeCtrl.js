var app = angular.module('HomeApp', ['ngRoute','googlechart']);
app.constant('API_URL', 'https://spreadsheets.google.com/feeds/list/0Ai2EnLApq68edEVRNU0xdW9QX1BqQXhHRl9sWDNfQXc/od6/public/basic?alt=json');

app.controller('homeCtrl', function ($scope, $http, API_URL) {

    $http.get(API_URL)
        .then(function (response) {
            $scope.api_response = response.data;
            $scope.api_entries = response.data.feed.entry;
            //console.log("api_response: " + JSON.stringify(response.data));
            //console.log("api_entries: " + JSON.stringify(response.data.feed.entry));

            var guessed_message_countries = [];
            var message_messages = [];
            var message_sentiments = [];

            angular.forEach($scope.api_entries, function (object, key) {
                var message_content = object.content.$t;
                //console.log("message_content[" + key + "]: " + message_content);
                var message_index = message_content.search("message:");
                var sentiment_index = message_content.search("sentiment:");
                message_message = message_content.slice(message_index + 9, sentiment_index - 2);
                message_messages.push(message_message);
                //console.log("message_message[" + key + "]: " + message_message);
                var temp_guessed_message_countries = message_message.match(/\b([A-Z][a-z']*)(\s[A-Z][a-z']*)*\b/g);
                if (temp_guessed_message_countries.length > 1) {
                    guessed_message_country = temp_guessed_message_countries[temp_guessed_message_countries.length - 1];
                } else {
                    guessed_message_country = temp_guessed_message_countries[0];
                }
                guessed_message_countries.push(guessed_message_country);
                //console.log("guessed_message_country[" + key + "]: " + guessed_message_country);
                message_sentiment = message_content.slice(sentiment_index + 11);
                message_sentiments.push(message_sentiment);
                //console.log("message_sentiment[" + key + "]: " + message_sentiment);
            })

            var messages_array_for_vis = [["Country", "Message", "Sentiment"]];
            angular.forEach(message_messages, function (message, key) {
                messages_array_for_vis.push([guessed_message_countries[key], message_messages[key], message_sentiments[key]]);
            })

            //console.log("messages_array_for_vis: " + JSON.stringify(messages_array_for_vis));

            var messagesChart = {};
            messagesChart.type = "Table";
            messagesChart.data = messages_array_for_vis;

            messagesChart.options = {
                width: "100%",
                height: "100%",
                chartArea: { left: 10, top: 10, bottom: 0, height: "100%" },
                colorAxis: { colors: ['#aec7e8', '#1f77b4'] },
                displayMode: 'markers'
            };
            $scope.messagesChart = messagesChart;
        });
});