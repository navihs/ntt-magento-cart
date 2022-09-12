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
                <th>SKU</th>
                <th>Qty</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding:0"><img src="http://localhost/media/catalog/product/m/b/mb01-blue-0.jpg" style="height:46px;"/></td>
                <td>Joust Duffle Bag</td>
                <td>24-MB01</td>
                <td>1</td>
                <td>34€</td>
            </tr>
        </tbody>
        <tfoot>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td><strong>Total</strong></td>
            <td>34€</td>
        </tr>
        </tfoot>
    </table>
    </div>
    </div>
    `,
    data: function() {
      return {
        
      }
    },
    methods: {
      
    },
    mounted(){
      
    }
  })
  