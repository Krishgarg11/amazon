var P = [
  {id:1,name:"boAt Rockerz 255 Pro+ Bluetooth Earphones",cat:"electronics",e:"🎧",price:1299,orig:3990,r:4.2,rv:41200,prime:true},
  {id:2,name:"Samsung Galaxy Tab A8 10.5 inch WiFi Tablet",cat:"electronics",e:"📱",price:19999,orig:27999,r:4.5,rv:9800,prime:true},
  {id:3,name:"Levi's Men's 511 Slim Fit Jeans",cat:"fashion",e:"👖",price:2499,orig:3999,r:4.4,rv:5620,prime:false},
  {id:4,name:"Prestige Iris 750W Mixer Grinder 3 Jars",cat:"home",e:"🥤",price:2299,orig:4500,r:4.3,rv:18200,prime:true},
  {id:5,name:"Atomic Habits by James Clear (Paperback)",cat:"books",e:"📗",price:399,orig:799,r:4.9,rv:34200,prime:false},
  {id:6,name:"Nike Air Max 270 Running Shoes",cat:"sports",e:"👟",price:8495,orig:11995,r:4.5,rv:7890,prime:true},
  {id:7,name:"Maybelline Fit Me Matte Poreless Foundation",cat:"beauty",e:"💄",price:349,orig:599,r:4.3,rv:23100,prime:false},
  {id:8,name:"LEGO Classic Creative Bricks 484 Pieces",cat:"toys",e:"🧱",price:2499,orig:3499,r:4.8,rv:4510,prime:true},
  {id:9,name:"Philips 43-Inch 4K Ultra HD LED Smart TV",cat:"electronics",e:"📺",price:29999,orig:55000,r:4.4,rv:6240,prime:true},
  {id:10,name:"Lakme 9 to 5 Primer + Matte Lipstick",cat:"beauty",e:"💋",price:279,orig:449,r:4.1,rv:31200,prime:false},
  {id:11,name:"Milton Thermosteel Flip Lid Flask 500ml",cat:"home",e:"🍶",price:699,orig:1299,r:4.6,rv:51000,prime:true},
  {id:12,name:"Zero to One by Peter Thiel (Paperback)",cat:"books",e:"📘",price:299,orig:499,r:4.7,rv:17320,prime:false},
  {id:13,name:"Cosco Talon Football Size 5",cat:"sports",e:"⚽",price:549,orig:999,r:4.2,rv:3420,prime:false},
  {id:14,name:"Roadster Men's Regular Polo T-Shirt",cat:"fashion",e:"👕",price:799,orig:1499,r:4.3,rv:12800,prime:true},
  {id:15,name:"Hot Wheels 20-Car Gift Pack",cat:"toys",e:"🏎️",price:1199,orig:2199,r:4.7,rv:5560,prime:true},
  {id:16,name:"Instant Pot Duo 7-in-1 Electric Pressure Cooker 3L",cat:"home",e:"🍲",price:6999,orig:10999,r:4.6,rv:18430,prime:true},
];
var cart = {};

function fmt(n) { return "\u20B9" + n.toLocaleString("en-IN"); }
function pct(o, p) { return Math.round((1 - p / o) * 100); }
function stars(r) {
  var s = "";
  for (var i = 1; i <= 5; i++)
    s += i <= Math.floor(r) ? "&#9733;" : (r % 1 >= 0.5 && i === Math.ceil(r) ? "&#189;" : "&#9734;");
  return s;
}

function render(list) {
  var g = document.getElementById("grid");
  if (!list.length) {
    g.innerHTML = '<div style="padding:40px;text-align:center;background:#fff;grid-column:1/-1;color:#666">No products found.</div>';
    return;
  }
  g.innerHTML = list.map(function(p) {
    return '<div class="card">'
      + '<div class="card-img">' + p.e + '</div>'
      + '<div class="card-name">' + p.name + '</div>'
      + '<div class="card-stars">' + stars(p.r) + ' <span>(' + p.rv.toLocaleString() + ')</span></div>'
      + '<div class="card-price">' + fmt(p.price) + '</div>'
      + '<div class="card-orig"><s>' + fmt(p.orig) + '</s> <em>-' + pct(p.orig, p.price) + '%</em></div>'
      + (p.prime ? '<div class="card-prime">&#10004; FREE Prime Delivery</div>' : '<div style="height:20px"></div>')
      + '<button class="add-btn" onclick="addCart(' + p.id + ')">Add to Cart</button>'
      + '</div>';
  }).join("");
}

function filterCat(cat) {
  document.getElementById("cat-sel").value = cat;
  var q = document.getElementById("q").value.toLowerCase();
  apply(cat, q);
}

function search() {
  var q = document.getElementById("q").value.toLowerCase();
  var cat = document.getElementById("cat-sel").value;
  apply(cat, q);
}

function apply(cat, q) {
  var list = P;
  if (cat !== "all") list = list.filter(function(p) { return p.cat === cat; });
  if (q) list = list.filter(function(p) { return p.name.toLowerCase().indexOf(q) > -1; });
  document.getElementById("stitle").textContent = q
    ? 'Results for "' + q + '"'
    : (cat === "all" ? "Featured Products" : cat.charAt(0).toUpperCase() + cat.slice(1));
  render(list);
}

function addCart(id) {
  var p = P.find(function(x) { return x.id === id; });
  if (!p) return;
  if (cart[id]) cart[id].qty++;
  else cart[id] = Object.assign({}, p, { qty: 1 });
  updateBadge();
  renderCart();
  showToast(p.e + " Added to cart");
}

function changeQty(id, d) {
  if (!cart[id]) return;
  cart[id].qty += d;
  if (cart[id].qty <= 0) delete cart[id];
  updateBadge();
  renderCart();
}

function updateBadge() {
  var t = Object.values(cart).reduce(function(s, i) { return s + i.qty; }, 0);
  document.getElementById("badge").textContent = t;
}

function renderCart() {
  var items = Object.values(cart);
  var body = document.getElementById("cbody");
  var foot = document.getElementById("cfoot");
  if (!items.length) {
    body.innerHTML = '<div class="empty">Your cart is empty.</div>';
    foot.style.display = "none";
    return;
  }
  body.innerHTML = items.map(function(i) {
    return '<div class="ci">'
      + '<div class="ci-img">' + i.e + '</div>'
      + '<div style="flex:1">'
      + '<div class="ci-name">' + i.name + '</div>'
      + '<div class="ci-price">' + fmt(i.price * i.qty) + '</div>'
      + '<div class="ci-qty">'
      + '<button onclick="changeQty(' + i.id + ',-1)">-</button>'
      + '<span>' + i.qty + '</span>'
      + '<button onclick="changeQty(' + i.id + ',1)">+</button>'
      + '<button class="ci-del" onclick="changeQty(' + i.id + ',-999)">Delete</button>'
      + '</div></div></div>';
  }).join("");
  var total = items.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  var count = items.reduce(function(s, i) { return s + i.qty; }, 0);
  document.getElementById("ctotal").textContent = fmt(total);
  document.getElementById("ccount").textContent = count;
  foot.style.display = "block";
}

function openCart() {
  document.getElementById("drawer").classList.add("on");
  document.getElementById("ov").classList.add("on");
}

function closeCart() {
  document.getElementById("drawer").classList.remove("on");
  document.getElementById("ov").classList.remove("on");
}

var tt;
function showToast(msg) {
  var el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("on");
  clearTimeout(tt);
  tt = setTimeout(function() { el.classList.remove("on"); }, 2000);
}

render(P);
renderCart();