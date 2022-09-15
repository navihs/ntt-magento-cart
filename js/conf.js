let Conf = {
    crm: {
        hostname: "",
        urls: {
            auth:"/Api/access_token",
            accounts: "/Api/V8/module/Accounts"
        },
        client_id: "",
        client_secret: "",
        auth_token: {
            token_type: "Bearer", 
            access_token: ""
    },
        options: {
            forceUseCartField: false
        }
    },
    magento: {
        hostname: "",
        mediaCatalog: "/media/catalog/product/cache/fefefazfez"
    },
    api: {
        hostname: "",
        urls: {
            carts: "",
            products: ""
        }
    }
}