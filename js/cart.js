Vue.component('cart',{
    template: `
    <div class="grid-container--fluid" style="margin-top:12px">
    <h4><span class="fa fa-shopping-cart"></span> Cart</h4>
    <div class="table-responsive scrollbars">
    <table class="table table-hover" v-if="suitecrm_cart">
        <thead>
            <tr>
                <th>Picture</th>
                <th>Product</th>
                <th>Product Code</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="entry in suitecrm_cart.entries">
                <td><img :src="entry.product.image.url" style="height:24px;"/></td>
                <td>
                    <a :href="'https://www.rexel.fr/frx'+entry.product.productUrl">{{decodeEntities(entry.product.productName)}}</a><br>
                    <span class="badge badge-primary" style="margin-right:2px" v-for="category in entry.product.categories">{{decodeEntities(category.name)}}</span>
                </td>
                <td>{{entry.product.productCode}}</td>
                <td>{{entry.quantity}}</td>
                <td>{{entry.totalPrice.formattedValue}}</td>
                <td>{{entry.product.stockAvailabilityCode}}</td>
            </tr>
        </tbody>
        <tfoot>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>Total</strong></td>
            <td>0€</td>
        </tr>
        </tfoot>
    </table>
    <table class="table table-hover mini-table" v-if="magento_cart">
        <thead>
            <tr>
                <th>Picture</th>
                <th>Product</th>
                <th>Product Code</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in magento_cart.items">
                <td><img :src="getMagentoProductImage(item.sku)" style="height:24px;"/></td>
                <td>{{item.name}}
                </td>
                <td>{{item.sku}}</td>
                <td>{{item.qty}}</td>
                <td>{{item.price}}€</td>
                <td>{{getMagentoProductStock(item.sku)}}</td>
            </tr>
        </tbody>
        <tfoot>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>Total</strong></td>
            <td>{{calculateMagentoTotal()}} €</td>
        </tr>
        </tfoot>
    </table>
    </div>
    </div>
    `,
    data: function() {
      return {
        magento_cart: null,
        suitecrm_cart: null,
        magento_products: []
      }
    },
    methods: {
        calculateMagentoTotal() {
          if(this.magento_cart && this.magento_cart.items.length > 0)
            return this.magento_cart.items.reduce((total, current) => total + current.qty * current.price, 0)
          else
            return 0;
        },
        decodeEntities(str){
            return decodeEntities(str);
        },
        getMagentoProductImage(sku){
          let product = this.magento_products.find(p => p.sku == sku);
          if(product){
            let uri = product.custom_attributes.find(attr => attr.attribute_code == "thumbnail").value
            return Conf.magento.hostname + Conf.magento.mediaCatalog + uri
          }else{
            return ""
          }
        },
        getMagentoProductStock(sku){
          let product = this.magento_products.find(p => p.sku == sku);
          if(product){
            let isInStock = product.extension_attributes.stock_item.is_in_stock
            let stockQty = product.extension_attributes.stock_item.qty
            return (isInStock)?`In Stock (${stockQty})`:`Not in Stock`
          }else{
            return `Not in Stock`
          }
        },
        start() {
          // Login CRM API
          SuiteCRM.login()
          .then((loginResponse) => {
            Conf.crm.auth_token = loginResponse.data
          })
          .then(() => {
            // Get CRM Account by PhoneNumber
            return SuiteCRM.getAccountByPhoneNumber("33637707684")
          })
          .then((getAccountResponse) => {
            console.log(getAccountResponse.data)
            const account = getAccountResponse.data.data[0];

            if(account){
              if(Conf.crm.options.forceUseCartField){
                // Cart read from CRM field
                console.log("NTT - ForceUseCartField enabled")
                let cart_content = decodeURI(account.attributes.cart_c);
                this.suitecrm_cart = JSON.parse(cart_content)
                console.log(this.cart)
              }else{
                // Cart read from MAgento
                console.log("NTT - ForceUseCartField disabled")
                Api.getCartsByCustomerId(account.attributes.magento_id_c)
                .then((magentoCart) => {
                  this.magento_cart = magentoCart.data.items[0];
                  return axios.all(this.magento_cart.items.map(cartItem => Api.getProductBySKU(cartItem.sku)))
                })
                .then((productsDetails) => {
                  this.magento_products = productsDetails.map(response => response.data);
                  console.log("productsDetails ", this.magento_products);
                })
              }
            }
            else{
              console.log("No account found")
            }
          })
        }
    },
    mounted(){
      this.start();
    }
  })
  