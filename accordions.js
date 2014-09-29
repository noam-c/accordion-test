(function(w) {

var AccordionInterval = 20;
var AccordionDefaultInitialSpeed = 0.1;
var AccordionList = [];
var AccordionTimer;

// Iterate through all existing accordions on the page and update their animation states
var AnimateAccordions = function AnimateAccordions()
{
	var animationsComplete = true;
	AccordionList.forEach(
		function animateAccordion(accordion)
		{
			var openingContent = accordion.openingContent;
			if(openingContent)
			{
				// If there is content expanding, then update its height
				openingContent.height += AccordionInterval * openingContent.speed;
				if(openingContent.height >= openingContent.element.scrollHeight)
				{
					// If the content pane is completely open (no overflow) then
					// allow the content to take its entire height, and set the accordion's open content to this pane
					openingContent.element.style.height = "auto";
					accordion.openedContent = openingContent.element;

					// Clear the openingContent field to indicate that the open animation is done.
					accordion.openingContent = null;
				}
				else
				{
					// If the opening content pane is not completely open, set its partially-open height
					openingContent.element.style.height = openingContent.height + "px";		

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
				closingContent.height -= AccordionInterval * closingContent.speed;
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
					closingContent.element.style.height = closingContent.height + "px";

					// Signal that animations aren't complete
					animationsComplete = false;
				}

				// Accelerate the closing animation
				closingContent.speed = closingContent.speed * 1.25;
			}
		}
	);

	if(animationsComplete)
	{
		// If we didn't find any other animations, then turn off the timer
		// to save CPU cycles.
		clearInterval(AccordionTimer);
		AccordionTimer = null;
	}
};

// Create and start the animation timer if it does not exist
var StartAccordionAnimations = function StartAccordionAnimations()
{
	if(!AccordionTimer)
	{
		AccordionTimer = setInterval(AnimateAccordions, AccordionInterval);
	}
};

w.Accordion = function Accordion(id, initialSpeed)
{
	// Do not check for element existence here.
	// If the developer invoked this function with a bad ID,
	// then we should bubble something up to the console instead
	// of failing silently (i.e. "if(!elem) return;")

	initialSpeed = initialSpeed || AccordionDefaultInitialSpeed;

	// Create a callback to respond to a signal to open an element
	function openElementById(i, contentToOpen)
	{
	}

	// Convert a container with an even number of child elements into an accordion
	var elem = document.getElementById(id);
	elem.className += " accordion";

	// In order to keep the accordion reference in scope for the click handler,
	// wrap it in a function that takes the current accordion instance as an argument,
	// thus saving the current value of "this"  in the closure that contains the click handler.
	// After this, other calls to this constructor will not modify the behavior of the
	// current click handler.
	// Another way to do this would be through the use of "bind(this)", but that function
	// is not supported across all the popular browser flavours at this time.
	(function initializeAccordion(accordion)
	{
		// At this point, we assume that the developer has correctly
		// formatted the accordion element, and the only child nodes of the element
		// are a sequence of {header, content, ..., header, content}

		for(var i = 0; i < elem.children.length; i += 2)
		{
			var header = elem.children[i];
			var content = elem.children[i+1];

			// Tag the header with an accordion-header class and an onclick that expands its associated content
			header.className += " accordion-header";
			header.onclick = function onClick(event)
			{
				// Don't respond to an event during an animation (let the user's previous expansion complete)
				if(accordion.openingContent || accordion.closingContent) return false;

				var openedContent = accordion.openedContent;

				// Don't respond to a request to open content that's already open
				if(openedContent === event.currentTarget.nextElementSibling) return;

				if(openedContent)
				{
					// If there is already opened content, signal a closing animation
					accordion.closingContent = { element: openedContent, height: openedContent.scrollHeight, speed: initialSpeed };
				}

				// Signal an opening animation and start the animator
				accordion.openingContent = { element: event.currentTarget.nextElementSibling, height: 0, speed: initialSpeed };
				StartAccordionAnimations();

				// Since we handled the click, stop its propagation and default behavior
				return false;
			}

			// Grab the associated content, tag it with an accordion-content class and close it
			content.className += " accordion-content";
			content.style.height = 0;
		}
	})(this);

	AccordionList.push(this);
};
})(window);
