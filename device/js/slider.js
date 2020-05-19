var sliderControl = document.querySelectorAll(".slider_btn");
var slider = document.querySelectorAll(".slide_item");

var tabsControl = document.querySelectorAll(".tabs_nav .btn");
var tabs = document.querySelectorAll(".tab_content");


if (!NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

sliderControl.forEach(function (component) {
	component.addEventListener('click', function () {
		let dataSlider = component.getAttribute('data-slide');
		slider.forEach(function (component) {
			if (dataSlider === component.getAttribute('data-slide')) {
				component.classList.remove('covered');
			} else {
				component.classList.add('covered');
			}
		});
		sliderControl.forEach(function (component) {
			component.classList.remove('current_btn');
		});
		component.classList.add('current_btn');
	});
});


tabsControl.forEach(function (component) {
	component.addEventListener('click', function () {
		let dataSlider = component.getAttribute('data-slide');
		tabs.forEach(function (component) {
			if (dataSlider === component.getAttribute('data-slide')) {
				component.classList.remove('covered');
			} else {
				component.classList.add('covered');
			}
		});
		tabsControl.forEach(function (component) {
			component.classList.remove('btn_active');
		});
		component.classList.add('btn_active');
	});
});