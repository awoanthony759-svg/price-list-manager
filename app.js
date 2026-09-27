/* =====================================================
   PRICE LIST MANAGER
===================================================== */


/* =====================================================
   SECURE FRONTEND DEMO CREDENTIALS

   IMPORTANT:
   This is NOT real authentication.

   The values below are SHA-256 hashes rather than
   plaintext credentials.

   For production authentication, use a backend.
===================================================== */


/*
   SHA-256 hash helper
*/

async function sha256(value) {

    const encoder = new TextEncoder();

    const data =
        encoder.encode(value);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    return hashArray
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");

}


/*
   These are hashes, not plaintext credentials.

   Do NOT replace them with your actual password
   or email in this public JavaScript file.
*/

const ADMIN_EMAIL_HASH =
    "REPLACE_WITH_EMAIL_HASH";

const ADMIN_PASSWORD_HASH =
    "REPLACE_WITH_PASSWORD_HASH";


/* =====================================================
   DEFAULT PRODUCTS
===================================================== */

const defaultProducts = [

    {
        id: 1,

        name: "Coca Cola",

        category: "Drinks",

        price: 500,

        image: "images/product-1.png"
    },

    {
        id: 2,

        name: "Bread",

        category: "Food",

        price: 1200,

        image: "images/product-2.avif"
    },

    {
        id: 3,

        name: "Wireless Mouse",

        category: "Electronics",

        price: 8500,

        image: "images/product-3.avif"
    },

    {
        id: 4,

        name: "T-Shirt",

        category: "Clothing",

        price: 6500,

        image: "images/product-6.jpeg"
    }

];


/* =====================================================
   PRODUCT STORAGE
===================================================== */

let products =
    JSON.parse(
        localStorage.getItem(
            "priceListProducts"
        )
    ) || defaultProducts;


/* =====================================================
   ELEMENTS
===================================================== */

const productTableBody =
    document.getElementById(
        "productTableBody"
    );


const emptyMessage =
    document.getElementById(
        "emptyMessage"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const categoryFilter =
    document.getElementById(
        "categoryFilter"
    );


const addItemBtn =
    document.getElementById(
        "addItemBtn"
    );


const productModal =
    document.getElementById(
        "productModal"
    );


const modalClose =
    document.getElementById(
        "modalClose"
    );


const productForm =
    document.getElementById(
        "productForm"
    );


const modalTitle =
    document.getElementById(
        "modalTitle"
    );


const productName =
    document.getElementById(
        "productName"
    );


const productCategory =
    document.getElementById(
        "productCategory"
    );


const productPrice =
    document.getElementById(
        "productPrice"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );


const registerForm =
    document.getElementById(
        "registerForm"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


const menuToggle =
    document.getElementById(
        "menuToggle"
    );


const mainNav =
    document.getElementById(
        "mainNav"
    );


const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );


/* =====================================================
   EDITING STATE
===================================================== */

let editingProductId = null;


/* =====================================================
   SAVE PRODUCTS
===================================================== */

function saveProducts() {

    localStorage.setItem(
        "priceListProducts",
        JSON.stringify(products)
    );

}


/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "en-NG",
        {
            style: "currency",

            currency: "NGN"
        }
    ).format(price);

}


/* =====================================================
   SAFE HTML
===================================================== */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function renderProducts() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedCategory =
        categoryFilter.value;


    const filteredProducts =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchTerm);


            const matchesCategory =
                selectedCategory === "all"
                ||
                product.category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    productTableBody.innerHTML = "";


    if (
        filteredProducts.length === 0
    ) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    filteredProducts.forEach(
        product => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    <span class="product-name">
                        ${escapeHTML(product.name)}
                    </span>
                </td>

                <td>
                    <span class="category">
                        ${escapeHTML(product.category)}
                    </span>
                </td>

                <td>
                    <strong>
                        ${formatPrice(product.price)}
                    </strong>
                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            type="button"
                            class="action-btn"
                            data-action="edit"
                            data-id="${product.id}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="action-btn delete-btn"
                            data-action="delete"
                            data-id="${product.id}"
                        >
                            Delete
                        </button>

                    </div>

                </td>
            `;


            productTableBody.appendChild(row);

        }
    );

}


/* =====================================================
   TABLE ACTIONS
===================================================== */

productTableBody.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {
            return;
        }


        const id =
            Number(button.dataset.id);


        if (
            button.dataset.action ===
            "edit"
        ) {

            editProduct(id);

        }


        if (
            button.dataset.action ===
            "delete"
        ) {

            deleteProduct(id);

        }

    }
);


/* =====================================================
   ADD PRODUCT
===================================================== */

addItemBtn.addEventListener(
    "click",
    () => {

        editingProductId = null;

        modalTitle.textContent =
            "Add Product";

        productForm.reset();

        productModal.classList.add(
            "active"
        );

        productModal.setAttribute(
            "aria-hidden",
            "false"
        );

        productName.focus();

    }
);


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeModal() {

    productModal.classList.remove(
        "active"
    );

    productModal.setAttribute(
        "aria-hidden",
        "true"
    );

    productForm.reset();

    editingProductId = null;

}


modalClose.addEventListener(
    "click",
    closeModal
);


productModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productModal
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            productModal.classList.contains(
                "active"
            )
        ) {

            closeModal();

        }

    }
);


/* =====================================================
   SAVE PRODUCT
===================================================== */

productForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            productName.value.trim();


        const category =
            productCategory.value;


        const price =
            Number(productPrice.value);


        if (
            !name ||
            !category ||
            !Number.isFinite(price) ||
            price < 0
        ) {

            return;

        }


        if (
            editingProductId !== null
        ) {

            const product =
                products.find(
                    item =>
                        item.id ===
                        editingProductId
                );


            if (product) {

                product.name =
                    name;

                product.category =
                    category;

                product.price =
                    price;

            }

        } else {

            products.push({

                id:
                    Date.now(),

                name,

                category,

                price

            });

        }


        saveProducts();

        renderProducts();

        closeModal();

    }
);


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) {
        return;
    }


    editingProductId =
        id;


    modalTitle.textContent =
        "Edit Product";


    productName.value =
        product.name;


    productCategory.value =
        product.category;


    productPrice.value =
        product.price;


    productModal.classList.add(
        "active"
    );


    productModal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

function deleteProduct(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) {
        return;
    }


    const confirmed =
        window.confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmed) {
        return;
    }


    products =
        products.filter(
            item =>
                item.id !== id
        );


    saveProducts();

    renderProducts();

}


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    renderProducts
);


/* =====================================================
   CATEGORY FILTER
===================================================== */

categoryFilter.addEventListener(
    "change",
    renderProducts
);


/* =====================================================
   USER LOGIN
===================================================== */

loginForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const email =
            document.getElementById(
                "loginEmail"
            ).value.trim();


        const remember =
            document.getElementById(
                "rememberMe"
            ).checked;


        if (remember) {

            localStorage.setItem(
                "rememberedEmail",
                email
            );

        } else {

            localStorage.removeItem(
                "rememberedEmail"
            );

        }


        showDashboard();

    }
);


/* =====================================================
   ADMIN LOGIN
===================================================== */

adminLoginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const email =
            document.getElementById(
                "adminEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "adminPassword"
            ).value;


        const emailHash =
            await sha256(email);


        const passwordHash =
            await sha256(password);


        const emailCorrect =
            emailHash ===
            ADMIN_EMAIL_HASH;


        const passwordCorrect =
            passwordHash ===
            ADMIN_PASSWORD_HASH;


        if (
            !emailCorrect ||
            !passwordCorrect
        ) {

            window.alert(
                "Invalid administrator credentials."
            );

            return;

        }


        showDashboard();

    }
);


/* =====================================================
   REGISTER
===================================================== */

registerForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "registerName"
            ).value.trim();


        if (!name) {
            return;
        }


        window.alert(
            "Your account has been created. You can now log in."
        );


        registerForm.reset();


        window.location.hash =
            "login";

    }
);


/* =====================================================
   FORGOT PASSWORD
===================================================== */

forgotPassword.addEventListener(
    "click",
    event => {

        event.preventDefault();


        window.alert(
            "Password recovery requires a backend email service."
        );

    }
);


/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard() {

    document
        .querySelectorAll(
            "main > section"
        )
        .forEach(section => {

            section.style.display =
                "none";

        });


    const dashboard =
        document.getElementById(
            "dashboard"
        );


    dashboard.classList.add(
        "active"
    );


    dashboard.style.display =
        "block";


    renderProducts();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   LOGOUT
===================================================== */

logoutBtn.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                "main > section"
            )
            .forEach(section => {

                section.style.display =
                    "";

            });


        document
            .getElementById(
                "dashboard"
            )
            .classList.remove(
                "active"
            );


        window.location.hash =
            "home";

    }
);


/* =====================================================
   MOBILE NAVIGATION
===================================================== */

menuToggle.addEventListener(
    "click",
    () => {

        mainNav.classList.toggle(
            "active"
        );

    }
);


mainNav
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mainNav.classList.remove(
                    "active"
                );

            }
        );

    });


/* =====================================================
   REMEMBERED EMAIL
===================================================== */

const rememberedEmail =
    localStorage.getItem(
        "rememberedEmail"
    );


if (rememberedEmail) {

    document.getElementById(
        "loginEmail"
    ).value =
        rememberedEmail;


    document.getElementById(
        "rememberMe"
    ).checked =
        true;

}


/* =====================================================
   INITIAL DISPLAY
===================================================== */

renderProducts();