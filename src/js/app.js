App = {
  web3Provider: null,
  contracts: {},
  account: '',
  contractAddress : '0xd167a0c4E22c0fAa1974D51A599d15303DE48A22',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("SecurityToken.json", function(SecurityToken) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.SecurityToken = TruffleContract(SecurityToken);
      // Connect provider to interact with contract
      App.contracts.SecurityToken.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.SecurityToken.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      console.log(instance);
      
    })
  },
  checkBal: function() {
    App.contracts.SecurityToken.deployed().then(function(instance) { 
      instance.balanceOf.call(accounts[0], { 
          from:web3.eth.accounts[0], 
          gas : 2131504,
          gasPrice: 200000000000
        })
        .then(function(res) {
          $('#balance').html('Account Balance : '+res+' SEC');
        })
    });
  },
  transfer: function() {
    App.contracts.SecurityToken.deployed().then(function(instance) { 
      var addr = $('#recAddr').val();
      var val = $('#amount').val();
      instance.transfer(addr, val, {
                          from : web3.eth.accounts[0], 
                          gas : 2131504,
                          gasPrice: 200000000000})
                      .then(function(res, err) { 
                        if(err) {
                          $('#message').html('Status Code : '+res.code+
                             '<br>Message : '+res.message+
                             '<br> Reason : '+res.stack);
                          
                        }   else {
                          $('#message').html('transferred successfully');
                        App.checkBal();
                        }  
                      }); 
                  
      /*instance.transfer.call(addr, val, { 
          from:web3.eth.accounts[0], 
          gas : 2131504,
          gasPrice: 200000000000
        })
        .then(function(res) {
          console.log(res);
          App.checkBal();
          
          
        })*/
    }); 
  },
  
  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    var accountsDiv = $('#accounts');
    var etherAddrDiv = $('#etherAddr');
    var joinBtn = $('#joinBtn');
    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        accounts = web3.eth.accounts;
        
        $('#accountAddress').html("Contract : "
                              +App.contractAddress+"<br>Acc. Addr : "
                              +accounts[0]+"");
        App.checkBal();
        loader.hide();
        content.show();
      }
    });
  },

};
$('#sendBtn').click(function() {
  App.transfer();
});

$(function() {
  $(window).load(function() {
    App.init();
  });
});