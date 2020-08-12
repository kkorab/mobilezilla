// contentfull

const client = contentful.createClient({
    space: "p0nuaakbvtiw",
    accessToken: "TaJ6YD3HhzphjW3hbtYQ7D9_izAxTsI-i3jW_P7DTNA"
});


//  ********* VARIABLES ********* 
const menuToggler = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const menuLinks = document.querySelectorAll('.menu__link');
const header = document.querySelector('.header');
const newIn = document.getElementById('new-in');
const cartIcon = document.querySelector('.fa-shopping-cart');
const cartTimesIcon = document.querySelector('.times-bag');
const brandsBtns = document.querySelectorAll('.brands-btn');
const brandsSlider = document.querySelector('.brands-product-slider');
const chosenItem = document.querySelector('.chosen-item');
const buyBtns = document.querySelectorAll(".buy-btn");
const bag = document.querySelector('.bag');
const clearBtn = document.querySelector('.clear-bag-btn');
const phones = [];
const bagItems = [];
const prices = JSON.parse(localStorage.getItem('items')) || [];

// ********* EVENTS ********* 

menuToggler.addEventListener('click', menuToggle);
menuLinks.forEach(menuLink => menuLink.addEventListener('click', closeMenu));
cartIcon.addEventListener('click', showCart);
cartTimesIcon.addEventListener('click', hideCart);
brandsBtns.forEach(btn => btn.addEventListener('click', displayPhonesByBrand));
brandsSlider.addEventListener('click', chooseModel);
brandsSlider.addEventListener('click', addItemToBag);
buyBtns.forEach(btn => btn.addEventListener('click', addItemToBag));
chosenItem.addEventListener('click', addItemToBag);
bag.addEventListener('click', changeQuantity);
bag.addEventListener('click', removeItem);
clearBtn.addEventListener('click', clearBag);
// getting json data into array
document.addEventListener('DOMContentLoaded', getPhonesDataOnLoad);
//scroll 
window.addEventListener('scroll', scrollNav);


// *********** FUNCTIONS ***********



//scroll functions
function scrollNav() {
    const nav = document.querySelector('.nav')
    const screenH = screen.height;
    let scrY = window.scrollY;
    let halfScreen = screenH * 0.6;
    let opacityStep = ((scrY / halfScreen) * 100) - 100;
    if (scrY > screenH) {
        nav.style.opacity = 1;
    } else if (scrY > (0.6 * screenH) && scrY < screenH) {
        header.classList.add('sticky');
        nav.style.opacity = opacityStep / 100;
    } else {
        header.classList.remove('sticky');
        nav.style.opacity = 1;
    }

}

// getting scrollbar width
function getScrollbarWidth() {

    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;

};

// MENU FUNCTIONS

function menuToggle() {
    if (nav.classList.contains("menu-opened")) {
        nav.classList.remove('menu-opened');
        document.body.classList.remove('no-scroll');
        document.body.style.marginRight = `0`;
    } else {
        nav.classList.add('menu-opened');
        document.body.classList.add('no-scroll');
        document.body.style.marginRight = `${getScrollbarWidth()}px`;
    }
};

// adding active class to chosen brand
function brandActive(e) {
    //removing all other active classes
    brandsBtns.forEach(btn => btn.classList.remove('active'));
    // adding active class
    e.currentTarget.classList.add('active');
    document.activeElement = null;
};

// close menu function when clicking on links in menu
function closeMenu(e) {
    if (window.innerWidth < 800) {
    const ect = e.currentTarget;
    e.preventDefault();
    nav.classList.remove('menu-opened');
    document.body.classList.remove('no-scroll');
    document.body.style.marginRight = `0`;
    setTimeout(() => {
        const id = ect.getAttribute('href').slice(1);
        const targetCoords = document.getElementById(id).getBoundingClientRect().top;
        const fixedCoords = scrollY + targetCoords;
        window.scrollTo({top: fixedCoords, left: 0, behavior: 'smooth'})
    }, 1000);
}};

// DISPLAYING PHONES FUNCTIONS

async function getPhonesDataOnLoad() {

    // contenful
    let contentful = await client.getEntries({
        content_type: 'mobilezilla',
    })
    let products = contentful.items;
    products = products.map(item => {
        const {id} = item.fields;
        const {brand, model, price, screenSize, system, connectivity, features} = item.fields;
        const img = item.fields.img.fields.file.url;
        return {id, brand, model, price, screenSize, system, connectivity, features, img};
    
    })
    products.sort((a,b) => a.id > b.id ? 1 : -1 )
    phones.push(...products)
    displayPhonesOnLoad();
};

function displayPhonesOnLoad() {
    brandsSlider.textContent = '';
    let text = '';
    if(window.innerWidth < 800) {
    phones.forEach(phone => {
        text += `
        <div class="item" data-id="${phone.id}">
            <h1 class="item-title">${phone.model}</h1>
            <img class="slider-img" src="${phone.img}" alt="phone-img">
            <div class="item-desc">
                <ul class="item-desc__ul>
                    <li><strong>Screen size:</strong> ${phone.screenSize}"</li>
                    <li><strong>Operating system:</strong> ${phone.system}</li>
                    <li><strong>Connectivity:</strong> ${phone.connectivity}</li>
                    <li><strong>Features:</strong> ${phone.features}</li>
                </ul>
            </div>
            <button class="buy-btn btn-grid" data-id=${phone.id}>${bagItems.find(bagItem => bagItem == phone) ? "Item has been added":"buy now"}</button>
        </div>
        `;
    });
    }
    else if(window.innerWidth>800) {
        phones.forEach(phone => {
        text += `
        <div class="item" data-id="${phone.id}">
            <h1 class="item-title">${phone.model}</h1>
            <img class="slider-img" src="${phone.img}" alt="phone-img">
            <div class="item-desc">
                <ul class="item-desc__ul>
                    <li><strong>Screen size:</strong> ${phone.screenSize}"</li>
                    <li><strong>Operating system:</strong> ${phone.system}</li>
                    <li><strong>Connectivity:</strong> ${phone.connectivity}</li>
                    <li><strong>Features:</strong> ${phone.features}</li>
                </ul>
            </div>
            <button class="buy-btn btn-grid" data-id=${phone.id}>${bagItems.find(bagItem => bagItem == phone) ? "Item has been added":"buy now"}</button>
        </div>
        `
    });
    }
    // creating slider container
    const sliderCnt = document.createElement('div');
    sliderCnt.classList.add('slider-container');
    sliderCnt.classList.add('reveal');
    sliderCnt.innerHTML = text;
    brandsSlider.appendChild(sliderCnt);
    getItemsFromLocalStorage();
    updateBagQuantityItems();
    displayNewIn();
    updateButtonText()
};

function displayNewIn() {
    const newPhones = [];
    const newPhonesGrid = document.querySelector('.grid');
    newPhones.push(phones[0], phones[4]);
    newPhones.forEach(newPhone => {
        const product = document.createElement('section');
        product.classList.add('product');
        product.innerHTML = `
        <img class="product-img" src="${newPhone.img}" alt="new-product-img">
        <div class="product-main-info">
            <h2 class="product__name">${newPhone.model}</h2>
            <h2 class="product__price">$${newPhone.price}</h2>
        </div>
        <div class="product__desc">
            <ul class="product__desc__ul>
                <li><strong>Screen size:</strong> ${newPhone.screenSize}"</li>
                <li><strong>Operating system:</strong> ${newPhone.system}</li>
                <li><strong>Connectivity:</strong> ${newPhone.connectivity}</li>
                <li><strong>Features:</strong> ${newPhone.features}</li>
            </ul>
        </div>
        <div class="btn-product-cnt">
            <button class="buy-btn" data-id="${newPhone.id}" type="submit">${bagItems.find(bagItem => bagItem == newPhone) ? "Item has been added" : "buy now"}
            </button>
        </div>
        `
        newPhonesGrid.appendChild(product);
        const buyButtons = newPhonesGrid.querySelectorAll('.buy-btn');
        buyButtons.forEach(btn => btn.addEventListener('click', addItemToBag))
    })
};

function displayPhonesByBrand(e) {
    brandActive(e);
    brandsSlider.textContent = "";
    let text = '';
    const brandClicked = e.currentTarget.dataset.brand;
    if (window.innerWidth <800) {
    phones.forEach(phone => {
        if (brandClicked === phone.brand.toLowerCase()) {
            text += `
                <div class="item" data-id="${phone.id}">
                    <h1 class="item-title">${phone.model}</h1>
                    <img class="slider-img" src="${phone.img}" alt="phone-img">
                </div>
                `
                
        } else if (brandClicked == "all") {
            text += `
                <div class="item" data-id="${phone.id}">
                    <h1 class="item-title">${phone.model}</h1>
                    <img class="slider-img" src="${phone.img}" alt="phone-img">
                </div>`
        } else return;
    })
}
    else if(window.innerWidth>800) {
        phones.forEach(phone => {
            if (brandClicked === phone.brand.toLowerCase()) {
                text += `
                    <div class="item" data-id="${phone.id}">
                        <h1 class="item-title">${phone.model}</h1>
                        <img class="slider-img" src="${phone.img}" alt="phone-img">
                        <div class="item-desc">
                            <ul class="item-desc__ul>
                                <li><strong>Screen size:</strong> ${phone.screenSize}"</li>
                                <li><strong>Operating system:</strong> ${phone.system}</li>
                                <li><strong>Connectivity:</strong> ${phone.connectivity}</li>
                                <li><strong>Features:</strong> ${phone.features}</li>
                            </ul>
                        </div>
                        <button class="buy-btn " data-id=${phone.id}>${bagItems.find(bagItem => bagItem == phone) ? "Item has been added":"buy now"}</button>
                    </div>
                    `
                    
            } else if (brandClicked == "all") {
                text += `
                <div class="item" data-id="${phone.id}">
                    <h1 class="item-title">${phone.model}</h1>
                    <img class="slider-img" src="${phone.img}" alt="phone-img">
                    <div class="item-desc">
                        <ul class="item-desc__ul>
                            <li><strong>Screen size:</strong> ${phone.screenSize}"</li>
                            <li><strong>Operating system:</strong> ${phone.system}</li>
                            <li><strong>Connectivity:</strong> ${phone.connevtivity}</li>
                            <li><strong>Features:</strong> ${phone.features}</li>
                        </ul>
                    </div>
                    <button class="buy-btn" data-id=${phone.id}>${bagItems.find(bagItem => bagItem == phone) ? "Item has been added":"buy now"}</button>
                </div>
                `
            } else return;
        })
    }
    const sliderCnt = document.createElement('div');
    sliderCnt.classList.add('slider-container');
    sliderCnt.innerHTML = text;
    brandsSlider.appendChild(sliderCnt);
};

function chooseModel(e) {
    if(window.innerWidth < 800) {
    chosenItem.textContent = '';
    let text = '';
    if (e.target.closest('.item')) {
        const itemClicked = e.target.closest('.item');
        const itemID = itemClicked.dataset.id;
        const chosenPhone = phones.find(phone => phone.id == itemID);
        // showing product in "chosen-item" section
        const chosenItemCnt = document.createElement('section');
        chosenItemCnt.classList.add('container');
        text += `
    <h2 class="chosen-item-title">Chosen smartphone</h2>
    <h4 class="chosen-item-model">${chosenPhone.brand}</h4>
    <h4 class="chosen-item-model">${chosenPhone.model}</h4>
    <article class="chosen-item-cnt">
        <div class="cnt-items">
            <img class="chosen-img" src="${chosenPhone.img}" alt="">
            <ul class="chosen-item-desc">
                <li class="chosen__list-item"><strong>Screen size:</strong> ${chosenPhone.screenSize}"</li>
                <li class="chosen__list-item"><strong>Operating system:</strong> ${chosenPhone.system}</li>
                <li class="chosen__list-item"><strong>Connectivity:</strong> ${chosenPhone.connevtivity}</li>
                <li class="chosen__list-item"><strong>Features:</strong> ${chosenPhone.features}</li>
                <h4 class="product__price">$${chosenPhone.price}</h4>
            </ul>
        </div>
        <button class="buy-btn" data-id=${chosenPhone.id}>${bagItems.find(bagItem => bagItem == chosenPhone) ? "Item has been added":"buy now"}</button>
    </article>`
        chosenItemCnt.innerHTML = text;
        chosenItem.appendChild(chosenItemCnt);
    } else {
        return;
    }
}
};

// CART FUNCTIONS

// cart functions 

function showCart() {
    document.body.classList.add('show-cart');
    document.body.classList.add('no-scroll');
    document.body.style.marginRight = `${getScrollbarWidth()}px`;
};

function hideCart() {
    document.body.classList.remove('show-cart');
    document.body.classList.remove('no-scroll');
    document.body.style.marginRight = "0";
};

function addItemToBag(e) {
    if (e.target.classList.contains("buy-btn")) {
        const phoneID = e.target.dataset.id;
        const phone = phones.find(phone => phone.id == phoneID);
        // const bagHeader = document.querySelector('.bag-header');
        const bagItemCnt = document.querySelector('.bag-items-cnt');
        const bagItem = document.createElement('div');
        bagItem.classList.add('bag-item');
        bagItem.setAttribute('data-id', phoneID); 
        bagItem.innerHTML = `
            <div class="bag-item-elements">
            <img src="${phone.img}" alt="phone image" class="bag-img">
            <div class="bag-item-info">
                <h4>${phone.model}</h4>
                <h4>$${phone.price}</h4>
            </div>
            </div>
            <div class="bag-right">
            <div class="bag-item-quantity">
                <i class="fas fa-arrow-up"></i>
                <h4 class="quantity" data-quantity="1">1</h4>
                <i class="fas fa-arrow-down"></i>
            </div>
            <i class="fas fa-trash"></i>
            </div>`
        if (bagItems.find(bagItem => bagItem == phone)) {
            const btn = e.target;
            btn.disabled = true;
        } else {
            const item = {
                id: phone.id,
                price: phone.price,
                quantity: 1
            }
            prices.push(item);
            bagItemCnt.appendChild(bagItem);
            bagItems.push(phone);
            e.target.textContent = 'Item has been added';
            showCart();
            updatePrice()
            updateLocalStorage();
            updateBagQuantityItems();
            updateButtonText()
        }
    } else return;
};

function changeQuantity(e) {
    if (e.target.classList.contains("fa-arrow-up")) {
        let quantity = e.target.nextElementSibling.dataset.quantity;
        quantity = parseInt(quantity) + 1;
        e.target.nextElementSibling.dataset.quantity = quantity;
        e.target.nextElementSibling.textContent = quantity;
        const index = prices.findIndex(price => price.id == e.target.closest('.bag-item').dataset.id);
        prices[index].quantity = quantity;
        updatePrice()
        updateLocalStorage()
    } else if (e.target.classList.contains("fa-arrow-down")) {
        let quantity = e.target.previousElementSibling.dataset.quantity
        if (quantity < 2) {
            return;
        } else {
            quantity = parseInt(quantity) - 1;
            e.target.previousElementSibling.dataset.quantity = quantity;
            e.target.previousElementSibling.textContent = quantity;
            const index = prices.findIndex(price => price.id == e.target.closest('.bag-item').dataset.id);
            prices[index].quantity = quantity;
            updatePrice()
            updateLocalStorage()
        }
    }
};

function removeItem(e) {
    if (e.target.classList.contains('fa-trash')) {
        const phone = e.target.closest('.bag-item');
        const phoneID = phone.dataset.id;
        const index = bagItems.findIndex(bagItem => bagItem.id == phoneID);
        phone.remove();
        bagItems.splice(index, 1);
        prices.splice(index, 1);
        updatePrice();
        updateLocalStorage()
        updateBagQuantityItems();
        updateButtonText()
    }
    else return;
};

function clearBag() {
    bagItems.splice(0, bagItems.length);
    prices.splice(0, prices.length);
    const allItems = document.querySelectorAll('.bag-item');
    allItems.forEach(item => item.remove());
    updatePrice();
    updateLocalStorage();
    updateBagQuantityItems();
    updateButtonText()
};

function updatePrice() {
    let total = 0;
    prices.forEach(item => {
        total += (item.price * item.quantity);
    })
    let text = () => prices.length ? `Total price: $${total}` :
        `Your bag is empty`;
    const totalPrice = document.querySelector('.total-price');
    totalPrice.textContent = text();
};

function updateBagQuantityItems() {
    const counter = bagItems.length;
    const bagItemsCounter = document.querySelector('.bag-items-counter')
    if (counter) {
        nav.classList.add('addedItems');
        bagItemsCounter.textContent = counter;

    }
    else {
        nav.classList.remove('addedItems');
    }
}

function updateButtonText() {
    const allBtns = [];
    const btns = Array.from(document.querySelectorAll('.buy-btn'));
    //all visible btns get enabled and text content: 'buy now'
    btns.forEach(btn => {
        btn.textContent = 'buy now';
        btn.disabled = false;
    })
    // finding btns that need to change and changing them
    bagItems.forEach(bagItem => {
        allBtns.push(btns.filter(btn => btn.dataset.id == bagItem.id));
    });
    const addedBtns = [...allBtns].flat();
    addedBtns.forEach(btn => {
        btn.textContent = 'Item has been added';
        btn.disabled = true;
    })
}

// ******** LOCAL STORAGE ********

function updateLocalStorage() {
    localStorage.setItem('items', JSON.stringify(prices));
}

function getItemsFromLocalStorage() {
    let counter = 0;
    const newArr = [];
    bagItems.push(...prices);
    bagItems.forEach(item => {
        newArr.push(phones.find(phone => phone.id == item.id));
    })
    bagItems.splice(0, bagItems.length);
    bagItems.push(...newArr);
    //displaying items in bag
    bagItems.forEach(item => {
        const bagItemCnt= document.querySelector('.bag-items-cnt');
        const bagItem = document.createElement('div');
        bagItem.classList.add('bag-item');
        bagItem.setAttribute('data-id', item.id);
        bagItem.innerHTML = `
        <div class="bag-item-elements">
        <img src="${item.img}" alt="phone image" class="bag-img">
        <div class="bag-item-info">
            <h4>${item.model}</h4>
            <h4>$${item.price}</h4>
        </div>
        </div>
        <div class="bag-right">
        <div class="bag-item-quantity">
            <i class="fas fa-arrow-up"></i>
            <h4 class="quantity" data-quantity="${prices[counter].quantity}">${prices[counter].quantity}</h4>
            <i class="fas fa-arrow-down"></i>
        </div>
        <i class="fas fa-trash"></i>
        </div>`
            bagItemCnt.appendChild(bagItem);
            updatePrice();
            counter++;
        }
    )};

// SCROLL REVEAL

ScrollReveal().reveal('.sub-headline', {delay: 500});
ScrollReveal().reveal('.headline', {delay: 1000});
ScrollReveal().reveal('.reveal-1500', {delay: 1500});

ScrollReveal().reveal('.product-img', {delay: 500});
ScrollReveal().reveal('.product-main-info', {delay: 800});
ScrollReveal().reveal('.product__desc', {delay: 1000});

ScrollReveal().reveal('.reveal');
