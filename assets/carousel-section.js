class AddToCart extends HTMLElement {
  constructor() {
    super();

    this.variantId = this.getAttribute('variant-id');
    this.button = this.querySelector('button');

    this.addEventListener('click', this.handleAddToCart.bind(this));
  }

  async handleAddToCart() {
    if (!this.variantId || this.button?.disabled) return;

    try {
      if (this.button) {
        this.button.disabled = true;
        this.button.textContent = 'Adding...';
      }

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: this.variantId,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      const data = await response.json();


      const cartResponse = await fetch('/cart.js');
const cartData = await cartResponse.json();

// Dispatch product and cart information
this.dispatchEvent(
  new CustomEvent('cart:added', {
    bubbles: true,
    detail: {
      product: data,
      itemCount: cartData.item_count
    }
  })
);

if (this.button) {
  this.button.textContent = 'Added to Cart';
}

      // Dispatch success event
      this.dispatchEvent(
        new CustomEvent('cart:added', {
          bubbles: true,
          detail: data
        })
      );

      if (this.button) {
        this.button.textContent = 'Added to Cart';
      }

      // Show popup only after successful add
      const popup = document.querySelector('.add_success_popup_container');

      if (popup) {
        popup.classList.add('is-active');
        this.showAddedProduct(data);
      }

    } catch (error) {
      console.error(error);

      if (this.button) {
        this.button.textContent = 'Add to Cart';
      }

    } finally {
      if (this.button) {
        this.button.disabled = false;
      }
    }
  }

  showAddedProduct(data) {

    const popup = document.querySelector('.add_success_popup_container');

    if (!popup) return;

    const image = popup.querySelector('.added_product_image');
    const title = popup.querySelector('.added_product_title');

    // Set product image
    image.src = data.image || '';
    image.alt = data.product_title || data.title || '';

    // Set product title
    title.textContent = data.product_title || data.title;

    // Show popup
    popup.classList.add('is-active');
}
}

customElements.define('add-to-cart', AddToCart);


// Close popup
document.addEventListener('click', function (event) {
  if (event.target.closest('.close_success_popup')) {
    const popup = document.querySelector('.add_success_popup_container');

    if (popup) {
      popup.classList.remove('is-active');
    }
  }
});



document.addEventListener('cart:added', function(event) {

  const product = event.detail.product;
  const itemCount = event.detail.itemCount;

  console.log('Added product:', product.product_title);
  console.log('Total cart items:', itemCount);

  // Update cart count
  const cartCount = document.querySelector('.cart_count span');

  if (cartCount) {
    cartCount.textContent = itemCount;
  }
});