

const contentDiv = document.getElementById("jsonResult")

function loadProducts(filter_id){fetch("JSON/project.json").then((response)=>response.json()).then((myobject)=>{
    let product_display=""
    
    for(let i=0; i<myobject.length; i++){
        if(myobject[i].filter_id===filter_id){
            let product_list = myobject[i].products

            for(let j in product_list){
                let my_products = product_list[j]
                product_display += product_function(my_products)
            }
        }
    }
    
    contentDiv.innerHTML=product_display
    let Carousel = document.getElementById("CR")
    Carousel.style.display = "none"
    contentDiv.style.display="block"
    contentDiv.style.backgroundColor = "rgba(33, 28, 33, 1)"
    contentDiv.style.maxWidth = "1450px"
    contentDiv.style.width="100%"
    
    contentDiv.style.height="500px"
    contentDiv.style.borderRadius="30px"
    contentDiv.style.margin="auto"
    contentDiv.style.marginTop="10px"
    contentDiv.style.color="black"
    contentDiv.style.display="flex"
    contentDiv.style.flexWrap="wrap"
    contentDiv.style.padding="20px"
    contentDiv.style.overflowY="scroll"
    

    let myrows=contentDiv.querySelectorAll(".myRow")
    myrows.forEach(res=>{
        
        res.style.margin="auto"
        res.style.width="400px"
        res.style.height="330px"
        res.style.textAlign="center"
        res.style.display="block"
        res.style.backgroundColor="rgba(210, 104, 178, 1)"
        res.style.borderRadius="10px"
        res.style.marginBottom="10px"
       
    })
   
    
    let images = contentDiv.querySelectorAll("img")
    images.forEach(img=>{
        img.style.height = "250px"
        img.style.width = "250px"
        img.style.marginTop="1px"
        img.style.borderRadius="5px"
        
    })
    let prices = contentDiv.querySelectorAll("#price")
    prices.forEach(price=>{
        price.style.paddingLeft="10px"
        price.style.fontSize='20px'
        price.style.marginTop="10px"
        price.style.float="left"
    })

    let myBtns = contentDiv.querySelectorAll("button")
    myBtns.forEach(btn=>{
        btn.style.color="white"
        btn.style.backgroundColor="black"
        btn.style.borderRadius="3px"
        btn.style.marginTop="10px"
        btn.style.float="right"
        btn.style.marginRight="10px"
       
    })
     
  
   
    
})}
    
 // function for display the json details in the webpage
function product_function(products){
    return `<div class="myRow">
    <h5>${products.product_name}</h5> 
    <img src="${products.img_src}"> <br>
    <span id="price">Price: ${products.price}</span>
    <span><button onclick="Addtocart('${products.product_name}', '${products.product_id}', '${products.img_src}', '${products.price}')">Add to Cart</button></span>

    </div>`
}


 // Get back the carousel 
  function carousel(){
    let Carousel=document.getElementById("CR")
    Carousel.style.display="block"
    contentDiv.style.display="none"
    
  }

/*///////////////////////*/
// set cookie
 function setCookie(cname, cvalue, minutes=2){
    let d = new Date()
    d.setTime(d.getTime()+minutes*60*1000)
    let expires = "expires="+d.toUTCString()
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/`
 }
// get cookie
 function getCookie(cname){
    let name=cname+"="
    let decodedCookie=decodeURIComponent(document.cookie)

    let ca=decodedCookie.split(';')

    for(let c of ca){
        while(c.charAt(0)==' ') c=c.substring(1)
        if (c.indexOf(name)==0)return c.substring(name.length, c.length)
 }
   return ""
 }

 // mycart
 
  

 // Addtocart
 function Addtocart(name, id, imgsrc, price){
    price=parseFloat(price)
    let username=getCookie("username")
    if(!username){
        username=prompt("Introduce Yourself")
        if(!username){
            alert("username is required!")
            return
        }
        setCookie("username", username,2)
    }
    let cart=JSON.parse(localStorage.getItem("cart"))||{}
    if(!cart[username]){
        cart[username]=[]
    }
    let existing=cart[username].find(item=>item.id===id)
    if(existing){
        existing.quantity+=1
    } else{
        cart[username].push({
            id, name, imgsrc, price, quantity:1
        })
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    alert(`${name} added to ${username}'s cart`)
    displayCart()

    document.getElementById("myCart").style.display="block"
    document.getElementById("cartDetails").style.display="block"
 }

 //Display cart in div
function displayCart() {
  let username = getCookie("username");
  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  let userCart = cart[username] || [];

  const cartDiv = document.getElementById("cartDetails");
  
  if (userCart.length === 0) {  // hide cart div
    cartDiv.innerHTML = "";
    cartDiv.style.display = "none";
    
    const finalBillModal = document.getElementById("finalBill"); // hide final bill
    if (finalBillModal) {
      finalBillModal.style.display = "none";
    }

      const checkoutContainer = document.getElementById("checkoutContainer");
      if (checkoutContainer) {
        checkoutContainer.style.display = "none";
      }

      const paymentCard = document.getElementById("paymentCard");
      if (paymentCard) {
        paymentCard.style.display = "none";
      }
      return
  }

 



  cartDiv.style.display = "block";

  let cartHTML = `<div class="welcome-msg"><h1>Welcome ${username}</h1></div>`;

  userCart.forEach((item, index) => {
    cartHTML += `
      <div class="cart-item" data-index="${index}">
        
        <p><strong>${item.name}</strong></p>
        <p>Price per item: ₹${item.price}</p>
        <p>
          Quantity: 
          <input type="number" min="1" value="${item.quantity}" class="qty-input" data-id="${item.id}" />
        </p>
        <span>Total Price: ₹<span class="total-price">${item.price * item.quantity}</span></span>
        <img src="${item.imgsrc}" />
        <button class="remove-btn" data-id="${item.id}">🗑️</button>
        

      </div>
    `;
  });

  cartHTML+=`<button id="clearCartBtn">Clear Cart</button>
             <button id="checkOutBtn">Check Out</button>`;
  

  cartDiv.innerHTML = cartHTML;

  // Attach quantity change listeners
  cartDiv.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", (e) => {
      let newQty = parseInt(e.target.value);
      const productId = e.target.dataset.id;
      let cart = JSON.parse(localStorage.getItem("cart"));
      let userCart = cart[username];
      let item = userCart.find(i => i.id === productId);
      if (item && newQty > 0) {
        item.quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        e.target.closest('.cart-item').querySelector('.total-price').textContent = item.price * item.quantity;
      }
      updateFinalBill();

    });
  });

  // Attach delete listeners
  cartDiv.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const productId = e.target.dataset.id;
      let cart = JSON.parse(localStorage.getItem("cart"));
      let userCart = cart[username];
      cart[username] = userCart.filter(item => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
      updateFinalBill();
    });
  });

  const clearCartBtn = document.getElementById("clearCartBtn");
  clearCartBtn.addEventListener("click", () => {
    cart[username] = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateFinalBill();
  });
      
}

// final bill
function createFinalBillModal() {
  const modal = document.getElementById("finalBill");
  modal.innerHTML = `
    <h2>Your Final Bill:</h2>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody id="billBody"></tbody>
    </table>
    <h3>Grand Total: ₹<span id="grandTotal">0</span></h3>
    <div class="btn-group">
      <button id="backBtn">Back</button>
      <button id="proceedBtn">Proceed To Pay</button>
    </div>
  `;
}
createFinalBillModal();


// event listener
document.addEventListener("click", function (e) {
  const username = getCookie("username");
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const userCart = cart[username] || [];

  if (e.target && e.target.id === "checkOutBtn") {
    // Update final bill content before showing
    updateFinalBillContent();

    // Show the container with both final bill and payment card
    const checkoutContainer = document.getElementById("checkoutContainer");
    checkoutContainer.style.display = "flex";

    // Show final bill, hide payment card initially
    document.getElementById("finalBill").style.display = "block";
    document.getElementById("paymentCard").style.display = "none";
  }

  if (e.target && e.target.id === "proceedBtn") {
    // Show payment card UI
    paymentCardUI();

    // Hide final bill, show payment card
    document.getElementById("finalBill").style.display = "block";
    document.getElementById("paymentCard").style.display = "block";
  }

  if (e.target && e.target.id === "backBtn") {
    // Hide the entire checkout container (final bill + payment card)
    document.getElementById("checkoutContainer").style.display = "none";
  }

  if (e.target && e.target.id === "backBtnPayment") {
    // From payment card back to final bill
    document.getElementById("paymentCard").style.display = "none";
    document.getElementById("finalBill").style.display = "block";
  }
  
  
  if(e.target && e.target.id === "payBtn"){
    
    if(!validatePayment()){
      return
    }
    // End of the shopping
    document.getElementById("checkoutContainer").style.display='none';
    alert("Thank you for shopping")

    
  }
});


// update final bill

function updateFinalBillContent() {
  const username = getCookie("username");
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const userCart = cart[username] || [];

  const billBody = document.getElementById("billBody");
  const grandTotalEl = document.getElementById("grandTotal");

  if (!billBody || !grandTotalEl) return; // Safety check

  let grandTotal = 0;
  billBody.innerHTML = "";

  userCart.forEach(item => {
    const total = parseFloat(item.price)*item.quantity;
    grandTotal += total;

    billBody.innerHTML += `
      <tr>
        <td><img src="${item.imgsrc}" style="width:60px; border-radius:5px;"/></td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
        <td>₹${total}</td>
      </tr>
    `;
  });

  grandTotalEl.textContent = grandTotal;
}

// Paymentcard
function paymentCardUI(){
  let paymentDiv=document.getElementById("paymentCard")
  paymentDiv.innerHTML = `
  <div class="payment-box">
    <h4>Amount Payable: ₹<span id="amountDisplay">${document.getElementById("grandTotal").textContent}</span></h4>
    <div class="card-icons">
      <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
      <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="MasterCard" />
      <img src="https://img.icons8.com/color/48/000000/rupay.png" alt="RuPay" />
    </div>
    <div class="cardNum">
      <label for="cardNumber" class="cardNumber">Card Number:</label>
        <input type="text" maxlength="4" class="card-segment"/> -
        <input type="text" maxlength="4" class="card-segment"/> -
        <input type="text" maxlength="4" class="card-segment"/> -
        <input type="text" maxlength="4" class="card-segment"/>
    </div>

   
      <div class="validTime">
        <label for="expiry">Valid Thru</label>
        <input type="text" id="expiry" placeholder="MM/YY" maxlength="5" />
      </div>
      <div class="lockPassword">
        <label for="cvv">CVV/CVV2</label>
        <input type="password" id="cvv" maxlength="4" placeholder="•••" />
      </div>


    <div class="amountPay">
      <label for="amount">Amount</label>
      <input type="text" id="amount" disabled value="₹${document.getElementById("grandTotal").textContent}" />
    </div>
    
     <button id="backBtnPayment">Back</button>
    <button id="payBtn">Confirm Payment</button>
   
  </div>
`;


  let grandTotal=document.getElementById("grandTotal")
  if (grandTotal){
    document.getElementById("amount").value=`₹${grandTotal.textContent}`
  }
  paymentDiv.style.display="block"
}

// paymentcard validation
function validatePayment(){
  const cardInputs=document.querySelectorAll('.payment-box .card-segment')
  const expiryInput=document.getElementById('expiry')
  const cvvInput=document.getElementById('cvv')

  //validate card number
  for(let input of cardInputs){
    if(input.value.length!==4 || !/^\d{4}$/.test(input.value)){
      alert("Please enter a valid card number")
      return false
    }
  }
  // validate expiry MM/YY
  if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryInput.value)){
    alert("Please enter a valid expiry date in MM/YY format")
    return false
  }

  // check if expiry is not in the past
  let [month,year]=expiryInput.value.split('/').map(Number)
  let currentDate=new Date()
  let currentYear=Number(currentDate.getFullYear().toString().slice(-2))
  let currentMonth=currentDate.getMonth()+1

  if(year<currentYear || (year===currentYear && month < currentMonth)){
    alert("The card expiry date cannot be in the past")
    return false
  }

  // validate cvv
  if(!/^\d{3,4}$/.test(cvvInput.value)){
    alert("Please enter a valid cvv")
    return false 
  }
  return true
}

