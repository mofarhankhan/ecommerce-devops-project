async function loadProducts() {

    try {

        const response = await fetch("/api/products");

        const products = await response.json();

        const container = document.getElementById("products");

        container.innerHTML = "";

        products.forEach(product => {

            const div = document.createElement("div");

            div.className = "product";

            div.innerHTML = `
                <h2>${product.name}</h2>
                <p>₹${product.price}</p>
            `;

            container.appendChild(div);

        });

    } catch (error) {

        console.log(error);

        document.getElementById("products").innerHTML =
            "<p>Failed to load products</p>";
    }
}
