(function(w) {
w.DatePopulator = function DatePopulator()
{
	// Returns a loading image
	var createLoadingElement = function createLoadingElement()
	{
		var element = document.createElement("div");
		element.className = "loading";
		return element;
	};

	// Make an AJAX request to a resource for content
	var getResource = function getResource(resourceName, successCallback, errorCallback)
	{
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		xhr.onreadystatechange = function onReadyStateChange()
		{
			if (xhr.readyState === 4)
			{
				if(xhr.status === 200)
				{
					successCallback(xhr.responseText);
				}
				else
				{
					errorCallback(xhr.status);
				}
			}
		}

		xhr.open("GET", resourceName, true /*asynchronous*/);
		xhr.send();	
	};

	// Populate a single element with date and time data
	this.populateElement = function populateElement(element)
	{
		if (!element)
		{
			return;
		}

		// Append a loading image to the element
		var loadingElement = createLoadingElement();
		element.appendChild(loadingElement);

		// Make a request for content with which we can populate the element (the date and time)
		getResource(
			"date.php",
			function onSuccess(text)
			{
				// Remove the loading image and add the text that was returned from date.php
				element.removeChild(loadingElement);
				var dateElement = document.createElement("p");
				var dateText = document.createTextNode(text);

				dateElement.appendChild(dateText);
				element.appendChild(dateElement);
			},
			function onError(errorCode) {
				// Remove the loading image and add text to indicate an error and allow the user to refresh.
				element.removeChild(loadingElement);
				var errorElement = document.createElement("p");
				errorElement.innerHTML = "An error occurred getting the date and time. Please <a href='javascript:this.location.reload();'>refresh the page</a> to try again. (Status: " + errorCode + ")";

				element.appendChild(errorElement);
			}
		);
	};

	var datePopulator = this;

	// Populate an array of elements with date and time data
	this.populateElements = function populateElements(elements)
	{
		if (elements)
		{
			// For each element to populate, append a loading image and then make a request for the date and time
			Array.prototype.forEach.call(elements, datePopulator.populateElement);
		}
	}.bind(this);
}
})(window);
