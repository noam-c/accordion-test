function initTestPage()
{
	var accordion = new Accordion('acc1');
	var datePopulator = new DatePopulator();
	datePopulator.populateElements(document.getElementsByClassName('date-time'));
}
