var accordions = function()
{
	var interval = 20;
	var initialSpeed = 0.1;
	var accordionList = {};

	// Keep a reference to 'this' for inner closures referencing this.timer	
	var self = this;
	
	// Iterate through all existing accordions on the page and update their animation states
	function animate()
	{
		var animationsComplete = true;
		for(var accordionId in accordionList)
		{
			var accordion = accordionList[accordionId];
			var openingContent = accordion.openingContent;
			if(openingContent)
			{
				// If there is content expanding, then update its height
				openingContent.height += interval * openingContent.speed;
				if(openingContent.height >= openingContent.element.scrollHeight)
				{
					// If the content pane is completely open (no overflow) then
					// set height to auto, and set the accordion's open content to this pane
					openingContent.element.style.height = 'auto';
					accordion.openedContent = openingContent.element;

					// Remove the openingContent field to indicate that the open animation is done.
					accordion.openingContent = null;
				}
				else
				{
					// If the opening content pane is not completely open, set its partially-open height
					openingContent.element.style.height = openingContent.height + 'px';		

					// Signal that animations aren't complete
					animationsComplete = false;
				}

				// Accelerate the opening animation
				openingContent.speed = openingContent.speed * 1.25;
			}

			var closingContent = accordion.closingContent;
			if(closingContent)
			{
				// If there is content closing, then update its height
				closingContent.height -= interval * closingContent.speed;
				if(closingContent.height <= 0)
				{
					// If the content pane is completely closed (height of 0) then
					// set height to 0
					closingContent.element.style.height = 0;

					// Remote the closingContent field to indicate that the closing animation is done.
					accordion.closingContent = null;
				}
				else
				{
					// If the closing content pane is not completely closed, set its partially-closed height
					closingContent.element.style.height = closingContent.height + 'px';

					// Signal that animations aren't complete
					animationsComplete = false;
				}

				// Accelerate the closing animation
				closingContent.speed = closingContent.speed * 1.25;
			}
		}

		if(animationsComplete)
		{
			// If we didn't find any other animations, then turn off the timer
			// to save CPU cycles.
			clearInterval(self.timer);
			self.timer = null;
		}
	}

	// Create and start the animation timer if it does not exist
	function startAnimator()
	{	
		if(!self.timer)
		{
			self.timer = setInterval(animate, interval);
		}
	}

	// Create a callback to respond to a signal to open an element
	function getOpenCallback(id, contentToOpen)
	{
		return function() 
		{
			var accordion = accordionList[id];
			// Don't respond to an event during an animation (let the user's previous expansion complete)
			if(accordion.openingContent || accordion.closingContent) return;

			var openedContent = accordion.openedContent;

			// Don't respond to a request to open content that's already open
			if(openedContent == contentToOpen) return;

			if(openedContent != null)
			{
				// If there is already opened content, signal a closing animation
				accordion.closingContent = { element:openedContent, height:openedContent.scrollHeight, speed:initialSpeed };
			}

			// Signal an opening animation and start the animator
			accordion.openingContent = { element:contentToOpen, height:0, speed:initialSpeed };
			startAnimator();

			// If there is an HREF on the entity that was clicked, we don't want to follow it
			return false;
		}
	}

	// Convert a container with an even number of child elements into an accordion
	function create(id)
	{
		var elem = document.getElementById(id);

		// Do not check for element existence here.
		// If the developer invoked this function with a bad ID,
		// then we should bubble something up to the console instead
		// of failing silently (i.e. 'if(!elem) return;')

		elem.className += ' accordion';

		// At this point, we assume that the developer has correctly
		// formatted the accordion element, and the only child nodes of the element
		// are a sequence of {header, content, ..., header, content}

		var child = elem.firstElementChild;	
		while(child)
		{
			// Tag the header with an accordion-header class and an onclick that expands its associated content
			child.className += ' accordion-header';
			child.onclick = getOpenCallback(id, child.nextElementSibling);

			// Grab the associated content, tag it with an accordion-content class and close it
			child = child.nextElementSibling;
			child.className += ' accordion-content';
			child.style.height = 0;

			// Move to the next header
			child = child.nextElementSibling;
		}

		accordionList[id] = {};
	}

	return { create: create };
}();
