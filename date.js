var date = function()
{
	// Returns a loading image
	function createLoadingElement()
	{
		var element = document.createElement('img');
		element.src = 'ajax-loader.gif';
		return element;
	}

	// Creates a callback for a successful AJAX request
	function createSuccessCallback(parentElement, loadingElement)
	{
		// Remove the loading image and add the text that was returned from date.php
		return function(text)
		{
			parentElement.removeChild(loadingElement);
			var dateElement = document.createElement('p');
			var dateText = document.createTextNode(text);

			dateElement.appendChild(dateText);
			parentElement.appendChild(dateElement);	
		}
	}

	// Creates a callback for an AJAX request erroring out
	function createErrorCallback(parentElement, loadingElement)
	{
		// Remove the loading image and add text to indicate an error and allow the user to refresh.
		return function(errorCode)
		{
			parentElement.removeChild(loadingElement);
			var errorElement = document.createElement('p');
			errorElement.innerHTML = "An error occurred getting the date and time. Please <a href='javascript:this.location.reload();'>refresh the page</a> to try again. (Status: " + errorCode + ")";

			parentElement.appendChild(errorElement);
		}
	}

	// Make an AJAX request to date.php for content
	function makeRequest(successCallback, errorCallback)
	{
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		xhr.onreadystatechange=function()
		{
			if (xhr.readyState==4)
			{
				if(xhr.status==200)
				{
					successCallback(xhr.responseText);
				}
				else
				{
					errorCallback(xhr.status);
				}
			}
		}

		xhr.open("GET", "date.php", true /*asynchronous*/);
		xhr.send();	
	}

	// Populate a single element with date and time data
	function populateElement(element)
	{
		// Append a loading image to the element
		var loadingElement = createLoadingElement();
		element.appendChild(loadingElement);

		// Make a request for content with which we can populate the element (the date and time)
		makeRequest(createSuccessCallback(element, loadingElement), createErrorCallback(element, loadingElement));
	}

	// Populate an array of elements with date and time data
	function populateElements(elements)
	{
		// For each element to populate, append a loading image and then make a request for the date and time
		for(var i = 0; i < elements.length; ++i)
		{
			populateElement(elements[i]);
		}
	}

	return { populateElement: populateElement, populateElements: populateElements };
}();
