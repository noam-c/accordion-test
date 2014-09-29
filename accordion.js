(function(w) {

var AccordionInterval = 20;
var AccordionDefaultInitialSpeed = 0.1;
var AccordionList = [];
var AccordionTimer;

var SetAccordionElementOpening = function SetAccordionElementOpening(headerElement, contentElement)
{
	contentElement.style.display = "block";
	contentElement.removeAttribute("aria-hidden");
};

var SetAccordionElementOpened = function SetAccordionElementOpened(headerElement, contentElement)
{
	headerElement.setAttribute("aria-expanded", "true");
	headerElement.setAttribute("aria-selected", "true");

	// If the content pane is completely open (no overflow) then
	// allow the content to take its entire height
	contentElement.style.height = "auto";
};

var SetAccordionElementClosed = function SetAccordionElementClosed(headerElement, contentElement)
{
	headerElement.setAttribute("aria-expanded", "false");
	headerElement.setAttribute("aria-selected", "false");

	// If the content pane is completely closed then
	// collapse and hide the content
	contentElement.style.height = 0;
	contentElement.style.display = "none";
	contentElement.setAttribute("aria-hidden", "true");
};

// Iterate through all existing accordions on the page and update their animation states
var AnimateAccordions = function AnimateAccordions()
{
	var animationsComplete = true;
	AccordionList.forEach(
		function animateAccordion(accordion)
		{
			var openingSection = accordion.openingSection;
			if(openingSection)
			{
				// If there is content expanding, then update its height
				openingSection.height += (AccordionInterval * openingSection.speed);
				if(openingSection.height >= openingSection.contentElement.scrollHeight)
				{
					SetAccordionElementOpened(openingSection.headerElement, openingSection.contentElement);
					accordion.openedSection = openingSection;

					// Clear the openingSection field to indicate that the open animation is done.
					accordion.openingSection = null;
				}
				else
				{
					// If the opening content pane is not completely open, set its partially-open height
					openingSection.contentElement.style.height = openingSection.height + "px";		

					// Signal that animations aren't complete
					animationsComplete = false;
				}

				// Accelerate the opening animation
				openingSection.speed = openingSection.speed * 1.25;
			}

			var closingSection = accordion.closingSection;
			if(closingSection)
			{
				// If there is content closing, then update its height
				closingSection.height -= AccordionInterval * closingSection.speed;
				if(closingSection.height <= 0)
				{
					SetAccordionElementClosed(closingSection.headerElement, closingSection.contentElement);

					// Clear the closingSection field to indicate that the closing animation is done.
					accordion.closingSection = null;
				}
				else
				{
					// If the closing content pane is not completely closed, set its partially-closed height
					closingSection.contentElement.style.height = closingSection.height + "px";

					// Signal that animations aren't complete
					animationsComplete = false;
				}

				// Accelerate the closing animation
				closingSection.speed = closingSection.speed * 1.25;
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

var EnterKeyCode = 13;
var SpaceKeyCode = 32;

w.Accordion = function Accordion(id, initialSpeed)
{
	initialSpeed = initialSpeed || AccordionDefaultInitialSpeed;

	// In order to keep the accordion reference in scope for the click handler,
	// wrap it in a function that takes the current accordion instance as an argument,
	// thus saving the current value of "this"  in the closure that contains the click handler.
	// After this, other calls to this constructor will not modify the behavior of the
	// current click handler.
	// Another way to do this would be through the use of "bind(this)", but that function
	// is not supported across all the popular browser flavours at this time.
	(function initializeAccordion(accordion)
	{
		// Do not check for element existence here.
		// If the developer invoked this function with a bad ID,
		// then we should bubble something up to the console instead
		// of failing silently (i.e. "if(!elem) return;")

		// Convert a container with an even number of child elements into an accordion
		var elem = document.getElementById(id);
		elem.className += " accordion";

		elem.setAttribute("role", "tablist");

		// At this point, we assume that the developer has correctly
		// formatted the accordion element, and the only child nodes of the element
		// are a sequence of {header, content, ..., header, content}

		for(var i = 0; i < elem.children.length; i += 2)
		{
			var headerElement = elem.children[i];

			// Tag the header element with an accordion-header class and an onclick that expands its associated content
			headerElement.className += " accordion-header";
			headerElement.setAttribute("role", "tab");
			headerElement.tabIndex = 0;
			var handleInvoke = function handleInvoke(event)
			{
				// Don't respond to an event during an animation (let the user's previous expansion complete)
				if(!accordion.openingSection && !accordion.closingSection)
				{
					var invokedContentElement = event.currentTarget.nextElementSibling;
					var currentlyOpenedSection = accordion.openedSection;

					if(currentlyOpenedSection)
					{
						// If there is already opened content, close it
						accordion.closingSection = { headerElement: currentlyOpenedSection.headerElement, contentElement: currentlyOpenedSection.contentElement, height: currentlyOpenedSection.contentElement.scrollHeight, speed: initialSpeed };
						accordion.openedSection = null;
					}

					// Only animate the content opening if it's not already opened
					if(!currentlyOpenedSection || currentlyOpenedSection.contentElement !== invokedContentElement)
					{
						SetAccordionElementOpening(event.currentTarget, invokedContentElement);

						// Signal an opening animation
						accordion.openingSection = { headerElement: event.currentTarget, contentElement: invokedContentElement, height: 0, speed: initialSpeed };
					}

					StartAccordionAnimations();
				}

				// Since we handled the invocation, stop its propagation and default behavior
				event.stopPropagation();
				return false;
			};

			headerElement.onclick = handleInvoke;
			headerElement.onkeydown = function handleKeyDown(event)
			{
				if(event.keyCode === EnterKeyCode || event.keyCode === SpaceKeyCode)
				{
					return handleInvoke(event);
				}
			};

			var contentElement = headerElement.nextElementSibling;

			// Grab the associated content, tag it with an accordion-content class and close it
			contentElement.className += " accordion-content";
			contentElement.setAttribute("role", "tabpanel");
			contentElement.setAttribute("aria-labelledby", headerElement.id);

			SetAccordionElementClosed(headerElement, contentElement);
		}
	})(this);

	AccordionList.push(this);
};
})(window);
