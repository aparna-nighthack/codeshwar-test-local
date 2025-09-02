# codeshwar-test-local

## Home Page with Chatbot and Sort Dropdown

This repo includes a simple static homepage that demonstrates:

- A filter bar with a dropdown to sort products by price: Default, Low to High, and High to Low. Sorting updates the grid instantly without reloading the page.
- A floating chatbot widget for basic user inquiries using lightweight, client-side replies (no backend required).

### Files

- `index.html`: Homepage markup, product grid, filter bar, and chatbot container.
- `styles.css`: Styling for layout, grid, and chatbot widget.
- `script.js`: Client-side sorting logic and a small rule-based chatbot.

### Run

Just open `index.html` in a browser. No build step needed.

### Customize

- Replace the example products in `index.html` with your data. Add a `data-price` attribute to each `.product-card` to enable sorting.
- Adjust chatbot responses in `script.js` inside the `replyTo()` function.
