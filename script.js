// Global variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 10;
let sortColumn = null;
let sortDirection = "asc";

// API URL
const API_URL = "https://api.escuelajs.co/api/v1/products";

// DOM Elements
const searchInput = document.getElementById("searchInput");
const limitSelect = document.getElementById("limitSelect");
const sortTitleBtn = document.getElementById("sortTitle");
const sortPriceBtn = document.getElementById("sortPrice");
const productTableBody = document.getElementById("productTableBody");
const paginationContainer = document.getElementById("paginationContainer");
const loadingIndicator = document.getElementById("loadingIndicator");
const tableContainer = document.getElementById("tableContainer");
const descriptionTooltip = document.getElementById("descriptionTooltip");

// Initialize the dashboard
async function init() {
  try {
    // Fetch products from API
    await fetchProducts();

    // Setup event listeners
    setupEventListeners();

    // Display products
    displayProducts();

    // Hide loading, show table
    loadingIndicator.style.display = "none";
    tableContainer.style.display = "block";
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    loadingIndicator.innerHTML = `
            <div class="alert alert-danger">
                <h4>Lỗi!</h4>
                <p>Không thể tải dữ liệu từ API. Vui lòng thử lại sau.</p>
            </div>
        `;
  }
}

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    allProducts = await response.json();
    filteredProducts = [...allProducts];
  } catch (error) {
    throw error;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality with onChange
  searchInput.addEventListener("input", handleSearch);

  // Limit select
  limitSelect.addEventListener("change", handleLimitChange);

  // Sort buttons
  sortTitleBtn.addEventListener("click", () => handleSort("title"));
  sortPriceBtn.addEventListener("click", () => handleSort("price"));
}

// Handle search functionality
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase().trim();

  if (searchTerm === "") {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm),
    );
  }

  // Reset to first page when searching
  currentPage = 1;

  // Re-apply current sort if any
  if (sortColumn) {
    applySorting();
  }

  displayProducts();
}

// Handle limit change
function handleLimitChange(event) {
  itemsPerPage = parseInt(event.target.value);
  currentPage = 1; // Reset to first page
  displayProducts();
}

// Handle sort functionality
function handleSort(column) {
  if (sortColumn === column) {
    // Toggle sort direction
    sortDirection = sortDirection === "asc" ? "desc" : "asc";
  } else {
    sortColumn = column;
    sortDirection = "asc";
  }

  applySorting();
  displayProducts();
}

// Apply sorting to filtered products
function applySorting() {
  filteredProducts.sort((a, b) => {
    let valueA, valueB;

    if (sortColumn === "title") {
      valueA = a.title.toLowerCase();
      valueB = b.title.toLowerCase();
    } else if (sortColumn === "price") {
      valueA = a.price;
      valueB = b.price;
    }

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
}

// Display products in table
function displayProducts() {
  // Calculate pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Clear table body
  productTableBody.innerHTML = "";

  // Check if no products found
  if (currentProducts.length === 0) {
    productTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <h5>Không tìm thấy sản phẩm nào</h5>
                </td>
            </tr>
        `;
  } else {
    // Add products to table
    currentProducts.forEach((product) => {
      const row = createProductRow(product);
      productTableBody.appendChild(row);
    });

    // Setup hover events for description tooltip
    setupTooltipEvents();
  }

  // Update pagination
  updatePagination(totalPages);

  // Update stats
  updateStats(startIndex + 1, endIndex, totalItems);
}

// Create product row
function createProductRow(product) {
  const row = document.createElement("tr");
  row.dataset.description = product.description || "Không có mô tả";

  // Get valid image URL
  const imageUrl = getValidImageUrl(product.images);

  row.innerHTML = `
        <td>${product.id}</td>
        <td>
            <img src="${imageUrl}" alt="${product.title}" class="product-image" 
                 referrerpolicy="no-referrer"
                 crossorigin="anonymous"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='https://placehold.co/80x80/eee/999?text=No+Image';">
        </td>
        <td>${product.title}</td>
        <td><span class="price-tag">$${product.price}</span></td>
        <td><span class="category-badge">${product.category?.name || "N/A"}</span></td>
    `;

  return row;
}

// Get valid image URL from product images array
function getValidImageUrl(images) {
  // Use a more reliable placeholder service
  const placeholder = "https://placehold.co/80x80/eee/999?text=No+Image";

  // Check if images exist and is array
  if (!images || !Array.isArray(images) || images.length === 0) {
    return placeholder;
  }

  // Try to find a valid URL
  for (let img of images) {
    // Skip if not string
    if (typeof img !== "string") continue;

    // Clean URL - remove quotes and brackets that might be in the string
    let cleanUrl = img.trim().replace(/^["'\[]+|["'\]]+$/g, "");

    // Check if it's a valid URL
    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
      // Additional check: make sure it's not a malformed URL
      try {
        new URL(cleanUrl);
        return cleanUrl;
      } catch (e) {
        continue;
      }
    }
  }

  // If no valid URL found, return placeholder
  return placeholder;
}

// Setup tooltip events for description
function setupTooltipEvents() {
  const rows = productTableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    row.addEventListener("mouseenter", handleRowHover);
    row.addEventListener("mouseleave", handleRowLeave);
    row.addEventListener("mousemove", handleRowMove);
  });
}

// Handle row hover - show description
function handleRowHover(event) {
  const description = event.currentTarget.dataset.description;
  const tooltipContent = descriptionTooltip.querySelector(".tooltip-content");
  tooltipContent.textContent = description;
  descriptionTooltip.classList.add("show");

  // Position tooltip near cursor
  positionTooltip(event);
}

// Handle row leave - hide description
function handleRowLeave(event) {
  descriptionTooltip.classList.remove("show");
}

// Handle row move - update tooltip position
function handleRowMove(event) {
  positionTooltip(event);
}

// Position tooltip near cursor
function positionTooltip(event) {
  const tooltip = descriptionTooltip;
  const offset = 15;

  let x = event.clientX + offset;
  let y = event.clientY + offset;

  // Prevent tooltip from going off-screen
  const tooltipRect = tooltip.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (x + tooltipRect.width > windowWidth) {
    x = event.clientX - tooltipRect.width - offset;
  }

  if (y + tooltipRect.height > windowHeight) {
    y = event.clientY - tooltipRect.height - offset;
  }

  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}

// Update pagination
function updatePagination(totalPages) {
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) {
    return; // No need for pagination
  }

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage - 1}">«</a>`;
  paginationContainer.appendChild(prevLi);

  // Page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust startPage if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // First page button
  if (startPage > 1) {
    const firstLi = document.createElement("li");
    firstLi.className = "page-item";
    firstLi.innerHTML = `<a class="page-link" href="#" data-page="1">1</a>`;
    paginationContainer.appendChild(firstLi);

    if (startPage > 2) {
      const dotsLi = document.createElement("li");
      dotsLi.className = "page-item disabled";
      dotsLi.innerHTML = `<a class="page-link" href="#">...</a>`;
      paginationContainer.appendChild(dotsLi);
    }
  }

  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
    paginationContainer.appendChild(li);
  }

  // Last page button
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dotsLi = document.createElement("li");
      dotsLi.className = "page-item disabled";
      dotsLi.innerHTML = `<a class="page-link" href="#">...</a>`;
      paginationContainer.appendChild(dotsLi);
    }

    const lastLi = document.createElement("li");
    lastLi.className = "page-item";
    lastLi.innerHTML = `<a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>`;
    paginationContainer.appendChild(lastLi);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  nextLi.innerHTML = `<a class="page-link" href="#" data-page="${currentPage + 1}">»</a>`;
  paginationContainer.appendChild(nextLi);

  // Add click event listeners
  paginationContainer.querySelectorAll(".page-link").forEach((link) => {
    link.addEventListener("click", handlePageClick);
  });
}

// Handle page click
function handlePageClick(event) {
  event.preventDefault();
  const page = parseInt(event.target.dataset.page);

  if (page && page !== currentPage) {
    currentPage = page;
    displayProducts();

    // Scroll to top of table
    tableContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Update stats
function updateStats(start, end, total) {
  document.getElementById("startItem").textContent = total > 0 ? start : 0;
  document.getElementById("endItem").textContent = end;
  document.getElementById("totalItems").textContent = total;
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
