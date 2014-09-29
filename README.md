This project is an implementation of jQuery's Accordion widget on a test page without using any helper frameworks (e.g. jQuery itself). The test page accordion is populated with data from a PHP page (currently just the date and time).

A description of the files follows:

* accordions.css - Stylesheet specifically used to enable accordion functionality
* accordions.js - Accordion object library: exposes functionality to convert a container into an accordion
* ajax-loader.gif - A loading image for AJAX requests (from http://www.ajaxload.info)
* date.js - DatePopulator object library: exposes functionality to populate elements with date and time
* date.php - A PHP script that simply provides the full local date and time
* testPage.html - A test page that displays a single accordion with four sections
* testPage.css - A stylesheet used for styling the test page accordion
* testPage.js - A script function that initializes the page.

This widget is provided under the terms of the MIT license. For more information, please refer to LICENSE.txt.
