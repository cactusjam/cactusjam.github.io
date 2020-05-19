var catalogData = [{
    isNew: true
},
{
    isNew: false
},
{
    isNew: false
},
{
    isNew: false
}
];

var updateCards = function (products) {
var elements = document.querySelectorAll('.catalog_items');
for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var product = products[i];
    if (product.isNew) {
        element.classList.add('new')
    }
}
};

updateCards(catalogData);