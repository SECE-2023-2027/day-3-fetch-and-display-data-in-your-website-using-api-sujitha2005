async function searchProducts() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const container = document.getElementById("tablesContainer");
    const loadingText = document.getElementById("loadingText");
    const notFound = document.getElementById("noResults");

    container.innerHTML = "";
    notFound.style.display = "none";

    if (!input.trim()) {
        alert("Please enter a search term.");
        return;
    }

    loadingText.style.display = "block";

    try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        loadingText.style.display = "none";

        const filteredByCategory = {};

        for (let i = 0; i < data.length; i++) {
            const product = data[i];
            const matchText = `${product.title} ${product.description} ${product.category}`.toLowerCase();

            if (matchText.includes(input)) {
                if (!filteredByCategory[product.category]) {
                    filteredByCategory[product.category] = [];
                }
                filteredByCategory[product.category].push(product);
            }
        }

        if (Object.keys(filteredByCategory).length === 0) {
            notFound.style.display = "block";
            return;
        }

        for (const category in filteredByCategory) {
            const title = document.createElement("h2");
            title.className = "category-title";
            title.textContent = category.toUpperCase();
            container.appendChild(title);

            const table = document.createElement("table");
            const thead = document.createElement("thead");
            thead.innerHTML = `
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Image</th>
            <th>Price</th>
            <th>Rating</th>
          </tr>
        `;

            const tbody = document.createElement("tbody");

            for (let i = 0; i < filteredByCategory[category].length; i++) {
                const p = filteredByCategory[category][i];
                const row = document.createElement("tr");

                row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.title}</td>
            <td><img src="${p.image}" alt="img" /></td>
            <td>$${p.price}</td>
            <td>${p.rating.rate}</td>
          `;

                tbody.appendChild(row);
            }

            table.appendChild(thead);
            table.appendChild(tbody);
            container.appendChild(table);
        }
    } catch (err) {
        loadingText.style.display = "none";
        container.innerHTML = "<p style='color:red;'>Something went wrong.</p>";
        console.error("Fetch failed:", err);
    }
}
