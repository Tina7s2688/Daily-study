// Formosa Leaf 台灣茶飲出口公司：練習用資料庫
window.SQL_SCHEMA = `
CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name TEXT, country TEXT, city TEXT, segment TEXT);
INSERT INTO customers VALUES
 (1,'Barcelona Tea House','Spain','Barcelona','Retail'),
 (2,'Madrid Bubble Co.','Spain','Madrid','Retail'),
 (3,'Paris The Club','France','Paris','Cafe'),
 (4,'Lyon Market','France','Lyon','Supermarket'),
 (5,'London Leaf Ltd','UK','London','Cafe'),
 (6,'Amsterdam Boba','Netherlands','Amsterdam','Cafe'),
 (7,'Rome Dolce Tea','Italy','Rome','Retail'),
 (8,'Berlin Teehaus','Germany','Berlin','Supermarket'),
 (9,'Prague Pearl','Czechia','Prague','Cafe'),
 (10,'Valencia Fresh','Spain','Valencia','Supermarket');

CREATE TABLE products (product_id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL);
INSERT INTO products VALUES
 (1,'Oolong Tea Leaves','Tea',120),
 (2,'Jasmine Green Tea','Tea',95),
 (3,'Black Pearl Tapioca','Topping',60),
 (4,'Brown Sugar Syrup','Syrup',45),
 (5,'Taro Powder','Powder',80),
 (6,'Matcha Powder','Powder',150),
 (7,'Lychee Jelly','Topping',55),
 (8,'Honey Syrup','Syrup',50);

CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, status TEXT);
INSERT INTO orders VALUES
 (101,1,'2026-01-05','Delivered'),
 (102,3,'2026-01-12','Delivered'),
 (103,5,'2026-01-20','Delivered'),
 (104,2,'2026-02-03','Delivered'),
 (105,6,'2026-02-10','Delivered'),
 (106,1,'2026-02-18','Delivered'),
 (107,4,'2026-03-02','Delivered'),
 (108,7,'2026-03-09','Cancelled'),
 (109,8,'2026-03-15','Delivered'),
 (110,9,'2026-03-22','Shipped'),
 (111,10,'2026-04-01','Shipped'),
 (112,3,'2026-04-05','Processing');

CREATE TABLE order_items (order_id INTEGER, product_id INTEGER, quantity INTEGER);
INSERT INTO order_items VALUES
 (101,1,10),(101,3,20),
 (102,2,8),(102,6,5),
 (103,1,6),(103,4,15),
 (104,3,30),(104,4,10),(104,5,5),
 (105,3,25),(105,7,12),
 (106,1,12),(106,8,10),
 (107,2,20),(107,5,10),
 (108,6,4),
 (109,1,15),(109,3,40),
 (110,7,8),(110,8,6),
 (111,3,18),(111,5,8),
 (112,6,6),(112,2,10);
`;

window.SQL_TABLES = [
  { name: "customers", zh: "客戶", cols: "customer_id 編號, name 名稱, country 國家, city 城市, segment 類型" },
  { name: "products", zh: "產品", cols: "product_id 編號, name 名稱, category 類別, price 價格（歐元／箱）" },
  { name: "orders", zh: "訂單", cols: "order_id 訂單編號, customer_id 客戶編號, order_date 日期, status 狀態" },
  { name: "order_items", zh: "訂單明細", cols: "order_id 訂單編號, product_id 產品編號, quantity 箱數" }
];

// ordered: true 代表結果的順序也要一樣
window.SQL_LEVELS = [
  {
    n: 1, title: "SELECT *：看整張表",
    boss: "先熟悉一下公司的客戶。把客戶資料表的全部資料拿給我看。",
    concept: "SELECT 是「選出」，* 代表「全部欄位」，FROM 後面接資料表名稱。每句 SQL 最後加分號 ;。",
    example: "SELECT * FROM products;",
    hint: "把範例裡的 products 換成客戶資料表的名字。",
    answer: "SELECT * FROM customers;"
  },
  {
    n: 2, title: "只選需要的欄位",
    boss: "全部欄位太多了，我只要客戶的名稱和國家。",
    concept: "把 * 換成欄位名稱，用逗號分開，就只會顯示那些欄位。",
    example: "SELECT name, price FROM products;",
    hint: "客戶名稱是 name，國家是 country。",
    answer: "SELECT name, country FROM customers;"
  },
  {
    n: 3, title: "WHERE：篩選資料",
    boss: "法國有哪些客戶？給我名稱和城市。",
    concept: "WHERE 後面寫條件，只留下符合的資料。文字要用單引號包起來，例如 'France'。",
    example: "SELECT name FROM products WHERE category = 'Tea';",
    hint: "條件是 country = 'France'，要選的欄位是 name, city。",
    answer: "SELECT name, city FROM customers WHERE country = 'France';"
  },
  {
    n: 4, title: "數字條件",
    boss: "哪些產品一箱超過 70 歐元？給我產品名稱和價格。",
    concept: "數字可以用 >、<、>=、<=、= 來比較。數字不用加引號。",
    example: "SELECT name FROM products WHERE price < 60;",
    hint: "條件是 price > 70。",
    answer: "SELECT name, price FROM products WHERE price > 70;"
  },
  {
    n: 5, title: "AND：同時符合兩個條件",
    boss: "西班牙的超市型客戶有哪些？只要名稱。",
    concept: "AND 代表兩個條件都要成立；OR 代表其中一個成立就好。",
    example: "SELECT name FROM customers WHERE country = 'France' AND segment = 'Cafe';",
    hint: "國家是 'Spain'，類型 segment 是 'Supermarket'。",
    answer: "SELECT name FROM customers WHERE country = 'Spain' AND segment = 'Supermarket';"
  },
  {
    n: 6, title: "ORDER BY：排序",
    boss: "把所有產品從最貴排到最便宜，給我名稱和價格。",
    concept: "ORDER BY 欄位 會排序。預設由小到大（ASC），加上 DESC 是由大到小。",
    example: "SELECT name, price FROM products ORDER BY price;",
    hint: "在範例最後加上 DESC。",
    answer: "SELECT name, price FROM products ORDER BY price DESC;",
    ordered: true
  },
  {
    n: 7, title: "LIMIT：只取前幾筆",
    boss: "我只想知道最貴的 3 項產品，名稱和價格。",
    concept: "LIMIT 數字 放在最後，只顯示前幾筆。常跟 ORDER BY 一起用來找「前幾名」。",
    example: "SELECT name FROM customers LIMIT 5;",
    hint: "先 ORDER BY price DESC，再加 LIMIT 3。",
    answer: "SELECT name, price FROM products ORDER BY price DESC LIMIT 3;",
    ordered: true
  },
  {
    n: 8, title: "COUNT：數數量",
    boss: "我們目前總共有幾筆訂單？",
    concept: "COUNT(*) 會算出有幾筆資料，結果只有一個數字。",
    example: "SELECT COUNT(*) FROM customers;",
    hint: "把 customers 換成訂單資料表。",
    answer: "SELECT COUNT(*) FROM orders;"
  },
  {
    n: 9, title: "GROUP BY：分組統計",
    boss: "每個國家各有幾個客戶？給我國家和客戶數。",
    concept: "GROUP BY 欄位 會把相同的值分成一組，再對每一組做 COUNT、SUM、AVG 等計算。",
    example: "SELECT category, COUNT(*) FROM products GROUP BY category;",
    hint: "選 country 和 COUNT(*)，FROM customers，GROUP BY country。",
    answer: "SELECT country, COUNT(*) FROM customers GROUP BY country;"
  },
  {
    n: 10, title: "AVG：平均",
    boss: "每一類產品的平均價格是多少？給我類別和平均價格。",
    concept: "AVG(欄位) 算平均，SUM(欄位) 算總和，MAX、MIN 找最大最小。通常搭配 GROUP BY。",
    example: "SELECT category, MAX(price) FROM products GROUP BY category;",
    hint: "把 MAX 換成 AVG。",
    answer: "SELECT category, AVG(price) FROM products GROUP BY category;"
  },
  {
    n: 11, title: "JOIN：合併兩張表",
    boss: "訂單表只有客戶編號，看不懂是誰。給我每筆訂單的編號和客戶名稱。",
    concept: "JOIN 把兩張表接起來，ON 寫「用哪個欄位對應」。欄位名稱重複時，用 表名.欄位 寫清楚。",
    example: "SELECT order_items.order_id, products.name\nFROM order_items\nJOIN products ON order_items.product_id = products.product_id;",
    hint: "orders 和 customers 用 customer_id 對應。選 orders.order_id 和 customers.name。",
    answer: "SELECT orders.order_id, customers.name\nFROM orders\nJOIN customers ON orders.customer_id = customers.customer_id;"
  },
  {
    n: 12, title: "綜合題：各國營業額",
    boss: "最後一題：扣掉取消的訂單，每個國家的營業額是多少？從高排到低。營業額 = 箱數 × 價格。",
    concept: "可以一次 JOIN 好幾張表。用 AS 幫表取短名（例如 orders AS o），計算欄位也可以用 AS 取名。",
    example: "SELECT p.category, SUM(oi.quantity) AS boxes\nFROM order_items AS oi\nJOIN products AS p ON oi.product_id = p.product_id\nGROUP BY p.category;",
    hint: "要接 4 張表：orders、customers、order_items、products。條件是 status != 'Cancelled'，計算 SUM(oi.quantity * p.price)，GROUP BY 國家，ORDER BY 營業額 DESC。",
    answer: "SELECT c.country, SUM(oi.quantity * p.price) AS revenue\nFROM orders AS o\nJOIN customers AS c ON o.customer_id = c.customer_id\nJOIN order_items AS oi ON o.order_id = oi.order_id\nJOIN products AS p ON oi.product_id = p.product_id\nWHERE o.status != 'Cancelled'\nGROUP BY c.country\nORDER BY revenue DESC;",
    ordered: true
  }
];
