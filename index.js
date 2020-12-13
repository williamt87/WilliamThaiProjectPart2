//Final Project - PART2 - William Thai

// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.


const express = require("express");
const app = express();


const morgan = require("morgan");
app.use(morgan("combined"));


const cors = require("cors");
app.use(cors());


const bodyParser = require("body-parser");
app.use(bodyParser.raw({ type: "*/*" }));





// object declaration with map

let pwd = new Map();
let chatMsg = new Map();
let token = new Map();
let everyProduct = new Map();
let prodList = new Map();
let usrKart = new Map();
let usrHist = new Map();
let usrItems = new Map();
let itemShipped = new Map();
let custReviews = new Map();
let prodReviews = new Map();


//token generation

let counter = 0;
let getSessionToken = () => {
  counter = counter + 1;
  return "Session Token" + counter;
}

let getProdListId = () => {
  counter = counter + 1;
  return "id" + counter;
}


// verify Header

const veriHeader = (req, resp)=>{
  if(req.headers['token'] !== undefined) return
  else return resp.send(JSON.stringify({
	  'success': false,
	  'reason': 'token field missing'
	  })
	 );
}

const veriToken = (req, resp) =>{
  if(usrSess.has(req.headers['token'])) return
  else return resp.send(JSON.stringify({
	  'success': false,
	  'reason': 'Invalid token'
	  })
	 );
}

// End of verify Header

// Sourcecode endpoint

app.get("/sourcecode", (req, resp) => {
  resp.send(
    require("fs")
    .readFileSync(__filename)
    .toString());
});

//this is the account creation part
//
//
// ---------- [signup] ---------- 

app.post("/signup", (req, resp) => {
	
  const parsedBody = JSON.parse(req.body);
  let newAccount = parsedBody.username;
  let password = parsedBody.password;
  //let rightPassword = pwd.get(userData);

  
  if (pwd.has(parsedBody.username)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Username exists"
    })
  );
    return;
    
  } if (parsedBody.password === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"password field missing"
    })
  );
    return;
    
  } if (parsedBody.username === undefined) {
    resp.send(
      JSON.stringify({
        "success":false,
        "reason":"username field missing"
      })
    );
    return;
 
  //user kart and user history
    
  }
  
  if(!usrKart.has(parsedBody.username)) {
    usrKart.set(parsedBody.username, [])
  }
  
  if(!usrHist.has(parsedBody.username)) {
    usrHist.set(parsedBody.username, [])
  }
  
  pwd.set(parsedBody.username, parsedBody.password);
  resp.send(JSON.stringify({"success":true}));
  
   //testing the console.log
 //
 //
 //console.log("signup:");
console.log("signup:" + newAccount + "password" + password);
//console.log("signup:" + newAccount + "password" + password);
  
});


// ---------- [login] ---------- 

app.post("/login", (req, resp) => {
  
  const parsedBody = JSON.parse(req.body);
  let newAccount = parsedBody.username;
  let rightPassword = pwd.get(newAccount);
  let password = parsedBody.password;
  
  
  if(newAccount === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"username field missing"
    })
  );
    return;
    
  } if(!pwd.has(newAccount)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"User does not exist"
    })
  );
    return;
    
  } if(password === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"password field missing"
    })
  );
    return;
    
  } if(password === rightPassword) {
    let uniqueToken = getSessionToken();
    token.set(uniqueToken, newAccount);
    resp.send(JSON.stringify({
      "success":true,
      "token":uniqueToken
    })
   );
    return;
    
    
  } else {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid password"
    })
  );
    return;
  }
  
    // console.log("login:");
    console.log("login:" + newAccount + "password" + password);
  
});


// Change Password
//
// 
// ---------- [Change Password] ---------- 

app.post("/change-password", (req, resp) => {
  
  const parsedBody = JSON.parse(req.body);
  
  let tokenP = req.headers.token;
  let usrP = token.get(tokenP);
  let previousPass = parsedBody.oldPassword;
  let currentPass = parsedBody.newPassword;
  let rightPassword = pwd.get(usrP);
  
  if(tokenP === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"token field missing"
    })
  );
    return;
    
  } if(!token.has(tokenP)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid token"
    })
  );
    return;
    
  } if(previousPass !== rightPassword) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Unable to authenticate"
    })
  );
    return;
    
  }
  pwd.set(usrP, currentPass);
  resp.send(JSON.stringify({"success":true}));
  
  // console.log("change-password:");
  console.log("change-password:" + usrP + "oldPassword" + previousPass + "newPassword" + currentPass);
  
});

// ---------- [create-listing] ---------- 

app.post("/create-listing", (req, resp) => {
  
  let tokenL = req.headers.token;
  const parsedBody = JSON.parse(req.body);
  let productPrice = parsedBody.price;
  let productDesc = parsedBody.description;
  let usr = token.get(tokenL);
  
  
  
  if(tokenL === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"token field missing"
    })
  );
    return;
    
  } if(!token.has(tokenL)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid token"
    })
  );
    return;
    
  } if(productPrice === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"price field missing"
    })
  );
    return;
    
  } if(productDesc === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"description field missing"
    })
  );
    return;
    
  }
  if(!usrItems.has(usr)) {
    usrItems.set(usr, []);
  }
  
  if(!custReviews.has(usr)) {
    custReviews.set(usr, []);
  }
  
  if(!itemShipped.has(usr)) {
    itemShipped.set(usr, []);
  }
  

  let prodId = getProdListId();
  let productList = usrItems.get(usr);
  let prodForSale = {price:productPrice, description:productDesc, sellerUsername:usr, itemId:prodId}
  let pItem = {price:productPrice, description:productDesc, seller:usr};

  everyProduct.set(prodId, pItem);
  prodList.set(prodId, pItem);
  productList.push(prodForSale);
  resp.send(JSON.stringify({"success":true,"listingId":prodId}));
  
      // console.log("create-listing:");
  console.log("create-listing:" + usr + "price" + productPrice);
  
})


// ---------- [modify-listing] ---------- 

app.post("/modify-listing", (req, resp) => {
  
  const parsedBody = JSON.parse(req.body);
  let tokenML = req.headers.token;
  let usr = token.get(tokenML);
  let prodId = parsedBody.itemid;
  let productList = usrItems.get(usr);
  
  
  if(tokenML === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"token field missing"
    })
  );
    return;
    
  } if(!token.has(tokenML)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid token"
    })
  );
    return;
    
  } if(prodId === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"itemid field missing"
    })
  );
    return;
    
  }
  
  
  let pItem = prodList.get(prodId);
  let price = pItem.price;
  let pDesc = pItem.description;
  
  if(parsedBody.price !== undefined) {
    price = parsedBody.price;
  } if(parsedBody.description !== undefined) {
    pDesc = parsedBody.description;
  }
  
  
  let modifyProd = {price:price,
                      description:pDesc,
                      seller:usr};
  prodList.set(prodId, modifyProd);
  everyProduct.set(prodId, modifyProd);
  
  
  let modifySellingProd = {price:price,
                          description:pDesc,
                          sellerUsername:usr,
                          itemId:prodId};
  
  for(var p = 0; p < productList.length; p++) {
    if(productList[p].itemId === prodId) {
      productList.splice(p, 1, modifySellingProd);
    }
  }
  
  resp.send(JSON.stringify({
    "success":true
  })
 );
  
  // console.log("modify-listing:");
  console.log("listing:" + prodId + "productList" + productList);
  
})


// ---------- [listing] ---------- 

app.get("/listing", (req, resp) => {
  let prodId = req.query.listingId;
  
  if(!prodList.has(prodId)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid listing id"
    })
  );
    return;
    
  }
  let pItem = prodList.get(prodId);
  let seller = pItem.seller;
  let pDesc= pItem.description;
  let price = pItem.price;
  
  
  
  resp.send(JSON.stringify({
    "success":true,
    "listing":{"price":price,
               "description":pDesc,
               "itemId":prodId,
               "sellerUsername":seller
              }})
           );
  
  // console.log("listing:");
  console.log("listing:" + pItem+ "price" + price);
  
})

// ---------- [cart] ---------- 

app.get("/cart", (req, resp) => {
  
  let tokenCart = req.headers.token;
  let usr = token.get(tokenCart);
  let cart = usrKart.get(usr);
  
  
  if(!token.has(tokenCart)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid token"
    })
  );
    return;
    
  }
  
    resp.send(JSON.stringify({
      "success":true,
      "cart":cart
    })
  );
  //console.log("cart":);
  console.log("cart:" + cart);
})


// ---------- [add-to-cart] ---------- 

app.post("/add-to-cart", (req, resp) => {
  
  let tokenAddCart = req.headers.token;
  const parsedBody = JSON.parse(req.body);
  let prodId = parsedBody.itemid;
  let usr = token.get(tokenAddCart);
  let cart = usrKart.get(usr);
  
  
  if(!token.has(tokenAddCart)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid token"
    })
  );
    return;
    
  } if(prodId === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"itemid field missing"
    })
  );
    return;
    
  } if(!prodList.has(prodId)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Item not found"
    })
   );
  }
  
  let item = prodList.get(prodId);
  let productPrice = item.price;
  let productDesc = item.description;
  let sellersItem = item.seller;
  
  cart.push({
    price:productPrice,
    description:productDesc,
    itemId:prodId,
    sellerUsername:sellersItem
  });
  
  resp.send(JSON.stringify({
    "success":true
  })
 );

  // console.log("add-to-cart:");
  console.log("add-to-cart:" + cart);

})


// ---------- [checkout] ---------- 

app.post("/checkout", (req, resp) => {
  
  let tokenCheckout = req.headers.token;
  let usr = token.get(tokenCheckout);
  let hist = usrHist.get(usr);
  let cart = usrKart.get(usr);
  
  
  if(!token.has(tokenCheckout)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid token"
    })
  );
    return;
    
  } if(cart.length === 0) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Empty cart"
    })
  );
    return;
    
  }
  
  for(var p = 0; p < cart.length; p++) {
	  
    if(!prodList.has(cart[p].itemId)) {
      resp.send(JSON.stringify({
        "success":false,
        "reason":"Item in cart no longer available"
      })
    );
      return;
      
    } else {
      prodList.delete(cart[p].itemId);
    }
  }
  Array.prototype.push.apply(hist, cart);
  cart = [];
  resp.send(JSON.stringify({
    "success":true
  })
 );

 // console.log("checkout:");
  console.log("checkout" + cart);

})

// ---------- [chat-messages] ---------- 

app.post("/chat-messages", (req, resp) => {
  
  let tokenMsg = req.headers.token;
  let usr = token.get(tokenMsg);
  let content;
  let dest;
  let parsedBody;
  

  if(JSON.stringify(req.body) !== JSON.stringify({})) {
    parsedBody = JSON.parse(req.body);
    dest = parsedBody.destination;
    content = parsedBody.contents;
  }
  
  let chatMsgList = chatMsg.get(dest+usr);

  if(!token.has(tokenMsg)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid token"
    })
   );
    
    
    return;
    
  } if(dest === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"destination field missing"
    })
   );
    return;
    
  } if(!pwd.has(dest)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Destination user not found"
    })
   );
    return;
    
  }
  resp.send(JSON.stringify({
    "success":true,
    "messages":chatMsgList
  })
 );

  // console.log("chat-messages:");
  console.log("chat-messages:" + content);

})


// ---------- [chat] ----------

app.post("/chat", (req, resp) => {
  
  let chatToken = req.headers.token;
  let usr = token.get(chatToken);
  let parsedBody;
  let content;
  let dest;
  
  
  if(JSON.stringify(req.body) !== JSON.stringify({})) {
    parsedBody = JSON.parse(req.body);
    dest = parsedBody.destination;
    content = parsedBody.contents;
  }

  if(!token.has(chatToken)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid token"
    })
   );
    return;
    
  } if(dest === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"destination field missing"
    })
   );
    return;
    
  } if(content === undefined) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"contents field missing"
    })
   );
    return;
    
  } if(!pwd.has(dest)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Destination user does not exist"
    })
   );
    return;
    
  }
  if(!chatMsg.has(usr+dest || dest+usr)) {
    chatMsg.set(dest+usr, []);
    chatMsg.set(usr+dest, []);
  }
  
    // console.log("chat":);
  console.log("body: " + JSON.stringify(req.body));
  
//  let chatMsgString = chatMsg.get(dest+usr);
//  let chatMsgStrings = chatMsg.get(usr+dest);
//  let chatMsg = {from:usr, contents: content}
//  chatMsgString.push(chatMsg);
//  chatMsgString.push(chatMsg);
//  resp.send(JSON.stringify({"success":true}));
  

 // console.log("chat:");
//  console.log("chatMsgString: " + chatMsgString + "" + "chatMsgStrings:" + chatMsgStrings + " " + "chatMsg" + chatMsg);
  
  let msgArr1 = chatMsg.get(dest+usr);
  let msgArr2 = chatMsg.get(usr+dest);
  let chattingMsg = {from:usr, contents:content}
  
  //console.log("chat":)
  console.log("array1: " + msgArr1 + " " + "array2: " + msgArr2 + " " + "msg: " + chattingMsg);
  
  msgArr1.push(chattingMsg);
  msgArr2.push(chattingMsg);
  resp.send(JSON.stringify({
    "success":true
  })
 );
  


})

// ---------- [ship] ----------

app.post("/ship", (req, resp) => {
  
  let tokenShip = req.headers.token;
  const parsedBody = JSON.parse(req.body);
  let usr = token.get(tokenShip);
  let dispatched = itemShipped.get(usr);
  let prodId = parsedBody.itemid;
  

  if(prodList.has(prodId)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Item was not sold"
    })
   );
    return;
    
  } if(dispatched.includes(prodId)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Item has already shipped"
    })
   );
    return;
    
  } if(everyProduct.get(prodId).seller !== usr) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"User is not selling that item"
    })
   );
    return;
    
  }
  dispatched.push(prodId);
  resp.send(JSON.stringify({
    "success":true
  })
 );

 // console.log("ship:");
  console.log("ship" + dispatched );

})

// ---------- [status] ----------

app.get("/status", (req, resp) => {
  
  let prodId = req.query.itemid;
  let item = everyProduct.get(prodId);
  let seller = item.seller;
  let productShipped = itemShipped.get(seller);

  if(prodList.has(prodId)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Item not sold"
    })
   );
    return;
    
  } 
  
  if(productShipped.includes(prodId)) {
    resp.send(JSON.stringify({
      "success":true,
      "status":"shipped"
    })
   );
  } else {
    
    resp.send(JSON.stringify({
      "success":true,
      "status":"not-shipped"
    })
   );
  }

 // console.log("status:");
  console.log("status " + item);

})


// ---------- [selling] ----------

app.get("/selling", (req, resp) => {
  let sellerSelling = req.query.sellerUsername;
  let productList = usrItems.get(sellerSelling);
  
  if(sellerSelling === undefined) {
    resp.send({
      "success":false,
      "reason":"sellerUsername field missing"
    });
    return;
    
  }
  resp.send({
    "success":true,
    "selling":productList});

 // console.log("selling:");

})

// ---------- [purchase-history] ----------

app.get("/purchase-history", (req, resp) => {
  
  let tokenHist = req.headers.token;
  let usr = token.get(tokenHist);
  let hist = usrHist.get(usr);
  
  if(!token.has(tokenHist)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid token"
    })
   );
    return;
    
  }
  
  resp.send(JSON.stringify({
    "success":true,
    "purchased":hist
  })
 );

 // console.log("purchase-history:");
  console.log("purchase-history:" + hist);

})

// ---------- [review-seller] ---------- 

app.post("/review-seller", (req, resp) => {
  
  let tokenReview = req.headers.token;
  const parsedBody = JSON.parse(req.body);
  let ratingStars = parsedBody.numStars;
  let reviewContent = parsedBody.contents;
  let prodId = parsedBody.itemid;
  let usr = token.get(tokenReview);
  let hist = usrHist.get(usr);
  let item = everyProduct.get(prodId);
  let seller = item.seller;
  let allReviewList = custReviews.get(seller);
  
  //console.log("item:");
  console.log("item: " + JSON.stringify(item));
  //console.log("seller:");
  console.log("seller: " + seller);

  
  if(!token.has(tokenReview)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"Invalid token"
    })
   );
    return;
    
  } if(prodReviews.has(prodId)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"This transaction was already reviewed"
    })
   );
    return;
    
  } if(!everyProduct.has(prodId) || !hist.some(item => item.itemId === prodId)) {
    resp.send(JSON.stringify({
      "success":false,
      "reason":"User has not purchased this item"
    })
   );
    return;
    
  }
  
  let reviews = {
    from:usr,
    numStars:ratingStars,
    contents:reviewContent
  };
  
  allReviewList.push(reviews);
  prodReviews.set(prodId, reviews);
  resp.send({"success":true})

 // console.log("review-seller:");
 // console.log("product: " + JSON.stringify(item));

})

// ---------- [reviews] ----------

app.get("/reviews", (req, resp) => {
  let reviewingSeller = req.query.sellerUsername;
  let allReviewList = custReviews.get(reviewingSeller);
  
  resp.send({
    "success":true,
    "reviews":allReviewList
  });

 // console.log("reviews:");

})


//const listener = app.listen(process.env.PORT, ());

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});