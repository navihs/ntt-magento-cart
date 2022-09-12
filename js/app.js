new Vue({
  el: '#app',
  data: {
  },
  methods: {
    
  },
  mounted(){
    
  }
})

const SuiteCRM = {
  login: () => {
    let bodyFormData = new FormData();
      bodyFormData.append('grant_type', 'client_credentials');
      bodyFormData.append('client_id', Conf.crm.client_id);
      bodyFormData.append('client_secret', Conf.crm.client_secret);
  
    return axios({
      method: 'post',
      url: `${Conf.crm.hostname}${Conf.crm.urls.auth}`, 
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" }
    })
  },
  getAccountByPhoneNumber: (phoneNumber) => {
    console.log(`TOKEN : ${Conf.crm.auth_token.token_type} ${Conf.crm.auth_token.access_token}`);
  
    return axios({
      method: 'get',
      url: `${Conf.crm.hostname}${Conf.crm.urls.accounts}?filter[phone_office][eq]=${phoneNumber}`, 
      headers: { 
        "Authorization": `${Conf.crm.auth_token.token_type} ${Conf.crm.auth_token.access_token}`,
        "Content-Type": "application/vnd.api+json", 
        "Accept": "application/vnd.api+json" 
      }
    })
  }
}

async function start(){
  // Login CRM API
  SuiteCRM.login()
  .then((loginResponse) => {
    Conf.crm.auth_token = loginResponse.data
  })
  .then(() => {
    // Get CRM Account by PhoneNumber
    return SuiteCRM.getAccountByPhoneNumber("3312345678")
  })
  .then((getAccountResponse) => {
    console.log(getAccountResponse.data)
  })
}

start();