# 🗃️  JuanKoop: Empowering cooperatives,uniting communities for development (Capstone Project) - Online marketPlace
This is a Capstone Project Developed as part of project for course Bachelor of Science in Information Technology at Technological University of the Philippines - Taguig
It a full - stack development Online Marketplace build using For mobile React-Native Expo For FrontEnd and For Backend using MERN (Mongodb, Express, React, Nodejs.)

It allows the users to purchase product, login, joining in membership and for cooperative they a able to track inventory, Crud for products.

## 🎯 Project Objective
- 🔐 Implement User Authentication
- 💬 Enable Real-Time Messaging & Notifications:
- 🧵 Build a Forum & Discussion Board
- 🗺️ Integrate Real-Time Map Navigation
- 👥 Support Cooperative Membership
- 🛒 Add Shopping Cart Feature
- 🧠 Incorporate Basic Sentiment Analysis

## 📚 Technologies Used

**Frontend Mobile:**
- React-native
- Axios
- FireBase
- Notifee
- Native-base
- Mapbox
- Open Street Map
- Socket IO
- HereMap
- Expo
  
**Backend:**
- React
- MongoDB
- Express
- Node.js
- WeatherBit IO
- Socket Io
- FireBase
- PayMongo
- Cloudinary
- AES-256-gcm

**Tools:**
- Git & GitHub
- PostMan (API Testing)
- VSCode
- MailTrap
- Render
- Vercel(For Exporation only)

## 🔐 Key Features
- User Registration and Login
- Coop Registration and Login
- Rider Registration and Login
- Create, read, update, and delete (CRUD) Product
- Create, read, update, and delete (CRUD) Inventory
- Real-time Message and notification
- Responsive user Interface
- Search and Filter items 

## ✍️ Reflection

As **str_vns**, I took on the role of a **Full Stack Developer** for this capstone project. I focused more on the **mobile development**, as I was the only one in the group confident enough to handle it. My groupmates supported me in some areas, such as design, but the core backend logic and integration were mostly handled by me—I contributed about **90% of the backend development**.

Being the only one responsible for building the **real-time messaging system** was particularly challenging. It required complex logic, and I had no one to rely on for that part. But through the struggle, I gained a much deeper understanding of what it means to be a Full Stack Developer.

Through this project, I learned to work with:
- **Firebase notifications**
- **Mapbox**, **Here Maps**, and **OpenStreetMap**
- **Weatherbit API**
- **Secure user data handling**
- **PayMongo integration**
- **Asynchronous operations**
- **Debugging full-stack interactions**
- **Using AES-256-GCM**

One of the hardest tasks was integrating **OSM (OpenStreetMap)** through a WebView. While it may seem simple, making it function properly inside the app took significant effort and troubleshooting.

Another major challenge was integrating **PayMongo**. I read through their documentation, but it didn’t clearly explain the flow for combining `paymentIntent` and `paymentMethodResponse`. Unlike other groups who used a more basic implementation, I wanted to build it with a deeper understanding rather than just copying code.

The most difficult part was handling the **payment confirmation redirect** back to the app. I eventually realized it required a **deployed payment page** that would redirect to a **deep link** in the app after confirmation. Figuring this out took me several hours, but it was a great learning experience about payment integration and user flow.

As for **Mapbox**, it was easy to integrate initially, but the cost limitations were a concern. We had to stay within the **free tier**, which affected how much we could use it in production. This pushed us to explore **OSM and Here Maps** as more budget-friendly alternatives.

In my OJT, I also realized areas that needed improvement. For example, our mobile app’s **code structure wasn’t reusable**, and many components were redundant. I wanted to fix it, but unfortunately, my groupmates couldn’t assist since they weren’t familiar with how to refactor the code.

Despite the difficulties and burnout I experienced, this project was a **valuable and fun learning experience**. It showed me both the demands and rewards of being a Full Stack Developer. Most of all, it reminded me that I still have a lot of room to grow—especially in writing clean, reusable code and managing complexity in large projects.
