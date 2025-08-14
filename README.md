

# 🛒 Ecommerce Backend API

This is a **Node.js + Express + MongoDB** backend for an ecommerce application.
It provides APIs for managing products, user authentication, carts, and image uploads.

---

## **📌 Features**

* User **signup** and **login** with JWT authentication
* Password hashing with **bcrypt**
* Product management (**add**, **delete**, **fetch**)
* Cart operations (**add**, **remove**, **view**)
* Fetch latest collections and popular products
* Image upload support with **Multer**
* Environment-based configuration via `.env`
* CORS support for frontend connection

---

## **📂 Project Structure**

```
📦 ecommerce-backend
├── upload/images         # Stores uploaded product images
├── .env                  # Environment variables
├── package.json          # Project dependencies
├── index.js             # Main backend code
└── README.md
└──             # Documentation
```

---

## **⚙️ Requirements**

Before running this project, install:

* [Node.js](https://nodejs.org/) (v14+ recommended)
* [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas) or local MongoDB instance
* Git

---

## **🔑 Environment Variables**

Create a `.env` file in the root directory with:

```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce
JWT_SECRET=secret_ecom
CLIENT_URL=http://localhost:3000
BASE_URL=http://localhost:4000
```

---

## **📦 Installation**

```bash
# 1️⃣ Clone repository
git clone https://github.com/Andred17/ecommerce-backend.git

# 2️⃣ Move into folder
cd ecommerce-backend

# 3️⃣ Install dependencies
npm install
```

---

## **▶️ Running the Server (Development)**

```bash
npm start
```

Server will start at:

```
http://localhost:4000
```

---

## **🛠 API Endpoints**

### **1. Authentication**

#### **Signup**

```http
POST /signup
Content-Type: application/json
```

**Body:**

```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

#### **Login**

```http
POST /login
Content-Type: application/json
```

**Body:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

---

### **2. Products**

#### **Add Product**

```http
POST /addproduct
```

**Body:**

```json
{
  "name": "T-shirt",
  "image": "http://example.com/image.jpg",
  "category": "men",
  "new_price": 20,
  "old_price": 30
}
```

#### **Delete Product**

```http
POST /removeproduct
```

**Body:**

```json
{
  "id": 1
}
```

#### **Get All Products**

```http
GET /allproducts
```

#### **Get New Collections**

```http
GET /newcollections
```

#### **Get Popular in Women**

```http
GET /popularinwomen
```

---

### **3. Cart**

All cart routes require an **auth-token** header with a valid JWT.

#### **Add to Cart**

```http
POST /addtocart
auth-token: <JWT_TOKEN>
```

**Body:**

```json
{
  "itemId": 5
}
```

#### **Remove from Cart**

```http
POST /removefromcart
auth-token: <JWT_TOKEN>
```

**Body:**

```json
{
  "itemId": 5
}
```

#### **Get Cart Data**

```http
POST /getcart
auth-token: <JWT_TOKEN>
```

---

### **4. Image Upload**

#### **Upload Product Image**

```http
POST /upload
```

* Send image in `multipart/form-data` with **field name** `product`.
* Response contains public image URL.

---

## **🔐 Authentication**

* Uses **JWT** to protect cart-related routes.
* Token must be sent via `auth-token` header.

---

## **🚀 Deployment**

### **Deploy on Render**

1. Push your code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com/).
3. Connect your GitHub repository.
4. Set **Build Command**:

   ```bash
   npm install
   ```
5. Set **Start Command**:

   ```bash
   node server.js
   ```
6. Add environment variables from `.env` in Render dashboard.
7. Deploy!

---

## **💡 Improvements**

* Switch image uploads to **Cloudinary** for permanent storage.
* Add product pagination and search filters.
* Encrypt JWT secret and database credentials.
* Add order management.

---

## **📝 License**

This project is licensed under the MIT License.

---

If you want, I can now create the **GitHub-ready README file** and format it with markdown styling so it looks perfect when you push the code.
Do you want me to prepare that exact file for you?
