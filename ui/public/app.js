function ProductRow({ product }) {
    return React.createElement(
        "tr",
        null,
        React.createElement(
            "td",
            null,
            product.id
        ),
        React.createElement(
            "td",
            null,
            product.Name
        ),
        React.createElement(
            "td",
            null,
            "$",
            product.Price
        ),
        React.createElement(
            "td",
            null,
            product.Category
        ),
        React.createElement(
            "td",
            null,
            React.createElement(
                "a",
                { href: product.Image, target: "_blank" },
                "View"
            )
        )
    );
}

function ProductTable({ products }) {
    const productRows = products.map(product => React.createElement(ProductRow, { key: product.id, product: product }));
    return React.createElement(
        "table",
        { className: "bordered-table" },
        React.createElement(
            "thead",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    null,
                    "ID"
                ),
                React.createElement(
                    "th",
                    null,
                    "Product Name"
                ),
                React.createElement(
                    "th",
                    null,
                    "Price"
                ),
                React.createElement(
                    "th",
                    null,
                    "Category"
                ),
                React.createElement(
                    "th",
                    null,
                    "Image"
                )
            )
        ),
        React.createElement(
            "tbody",
            null,
            productRows
        )
    );
}

class ProductAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.productAdd;
        const product = {
            product_name: form.product_name.value,
            price: form.price.value.split('$'),
            category: form.category.value,
            image: form.imageUrl.value,
            status: 'New'
        };
        this.props.createProduct(product);
        form.product_name.value = "";
        form.price.value = "$";
        form.category.value = "None";
        form.imageUrl.value = "";
    }
    render() {
        return React.createElement(
            "form",
            { name: "productAdd", onSubmit: this.handleSubmit, className: "formstyle" },
            React.createElement(
                "div",
                null,
                React.createElement(
                    "p",
                    null,
                    React.createElement(
                        "label",
                        null,
                        "Product Name",
                        React.createElement("br", null),
                        React.createElement("input", { type: "text", name: "product_name", placeholder: "Product Name" })
                    )
                ),
                React.createElement(
                    "p",
                    null,
                    React.createElement(
                        "label",
                        null,
                        "Price Per Unit",
                        React.createElement("br", null),
                        React.createElement("input", { type: "text", name: "price", placeholder: "Price", defaultValue: "$" })
                    )
                ),
                React.createElement("br", null),
                React.createElement(
                    "button",
                    { className: "categorystyle" },
                    "AddProduct"
                )
            ),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "p",
                    null,
                    React.createElement(
                        "label",
                        null,
                        "Category",
                        React.createElement("br", null),
                        React.createElement(
                            "select",
                            { name: "category", className: "categorystyle" },
                            React.createElement(
                                "option",
                                { value: "None" },
                                "Select"
                            ),
                            React.createElement(
                                "option",
                                { value: "Shirts" },
                                "Shirts"
                            ),
                            React.createElement(
                                "option",
                                { value: "Jeans" },
                                "Jeans"
                            ),
                            React.createElement(
                                "option",
                                { value: "Jackets" },
                                "Jackets"
                            ),
                            React.createElement(
                                "option",
                                { value: "Sweaters" },
                                "Sweaters"
                            ),
                            React.createElement(
                                "option",
                                { value: "Accessories" },
                                "Accessories"
                            )
                        )
                    )
                ),
                React.createElement(
                    "p",
                    null,
                    React.createElement(
                        "label",
                        null,
                        "Image URL",
                        React.createElement("br", null),
                        React.createElement("input", { type: "text", name: "imageUrl", placeholder: "Image URL" })
                    )
                )
            )
        );
    }
}

class ProductList extends React.Component {
    constructor() {
        super();
        this.state = { products: []
        };

        this.createProduct = this.createProduct.bind(this);
    }
    componentDidMount() {
        this.loadData();
    }

    async loadData() {

        const query = `query{
        productList{
            id Name Price Image Category
        }
    }`;

        const response = await fetch(window.ENV.UI_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const result = await response.json();
        this.setState({ products: result.data.productList });
    }

    async createProduct(product) {
        const newProduct = product;
        const query = `mutation {
        productAdd(product:{
          Name: "${newProduct.product_name}",
          Price: ${newProduct.price},
          Image: "${newProduct.image}",
          Category: ${newProduct.category},
        }) {
          id
        }
      }`;

        await fetch(window.ENV.UI_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        this.loadData();
    }
    render() {
        const { products } = this.state;
        return React.createElement(
            "div",
            null,
            React.createElement(
                "h1",
                null,
                "My Company Inventory"
            ),
            React.createElement(
                "h2",
                null,
                "Showing all available products"
            ),
            React.createElement("hr", null),
            React.createElement(ProductTable, { products: products }),
            React.createElement("br", null),
            React.createElement(
                "h2",
                null,
                "Add a new product to inventory"
            ),
            React.createElement("hr", null),
            React.createElement(ProductAdd, { createProduct: this.createProduct })
        );
    }
}

const element = React.createElement(ProductList, null);
ReactDOM.render(element, document.getElementById('contents'));