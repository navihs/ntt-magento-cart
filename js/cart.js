Vue.component('cart',{
    template: `
    <div class="grid-container--fluid">
    <h4>Cart</h4>
    <div class="table-responsive scrollbars">
    <table class="table table-hover">
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
            <tr v-for="entry in cart.entries">
                <td style="padding:0"><img :src="entry.product.image.url" style="height:46px;position: relative;top: 50%;transform: translateY(50%);"/></td>
                <td>
                    <a :href="'https://www.rexel.fr/frx'+entry.product.productUrl">{{decodeEntities(entry.product.productName)}}</a><br>
                    <span class="badge badge-primary" v-for="category in entry.product.categories">{{decodeEntities(category.name)}} </span>
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
    </div>
    </div>
    `,
    data: function() {
      return {
        cart: {}
      }
    },
    methods: {
        decodeEntities(str){
            return decodeEntities(str);
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
                let cart_content = decodeURI(account.attributes.cart_c);
                this.cart = JSON.parse(cart_content)
                console.log(this.cart)
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
  