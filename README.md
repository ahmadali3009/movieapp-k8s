# Cineverse: AI-Enhanced Movie Discovery Platform

## 📝 Project Overview

Cineverse is a full-stack, AI-enhanced movie discovery platform built with the MERN stack (MongoDB, Express.js, React, Node.js). The application seamlessly integrates with the TMDB and Gemini APIs to provide intelligent movie insights and real-time search functionality. It is designed with a focus on security, performance, and a smooth user experience.

---

## ✨ Key Features

* **AI-Enhanced Movie Insights**: Integrates with the Gemini API to provide intelligent movie insights and recommendations using prompt engineering.
* **Real-Time Search**: Allows users to find movies instantly with real-time search functionality.
* **Comprehensive Security**: Features a robust JWT authentication system with a new refresh token implementation. Key API calls, such as the one for "top rated" movies, have been moved to the backend to enhance security and prevent direct exposure of API keys.
* **Performance Optimization**: Utilizes **React Query caching** and **smart pagination** to boost data efficiency by 40% and significantly reduce server load.
* **Code Quality**: Achieved a Lighthouse score of 80+ by implementing **lazy loading** and **responsive images**, ensuring fast load times and full accessibility.
* **Rate Limiting**: Implements a rate limiter for the Gemini API calls, restricting usage to 7 calls per day to manage costs and prevent abuse.
* **Mobile-Friendly Design**: The application is fully responsive, providing a consistent user experience across all devices.

---

## 🛠️ Tech Stack

### Frontend
* **React.js**: For building the user interface.
* **React Query**: For server-state management and data fetching.
* **TypeScript**: For type safty.
* **Context API**: To handle state management efficiently.
* **Tailwind CSS**: A utility-first CSS framework for modern styling.

### Backend
* **Node.js & Express.js**: For the server-side logic and RESTful API.
* **MongoDB Atlas**: A cloud-based NoSQL database for storing user and application data.
* **Mongoose**: An object modeling tool for MongoDB.
* **JWT & bcrypt**: For secure user authentication and password hashing.
* **TMDB API**: To fetch movie data.
* **Gemini API**: For AI-powered movie insights.

### DevOps & Deployment
* **Docker & Docker Compose**: The entire application is containerized for seamless deployment across different environments.
* **Nginx**: Used as a reverse proxy to handle requests and improve performance.
* **Render/Netlify**: The application is configured for deployment on cloud platforms like Render and Netlify.

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally using Docker.

### Prerequisites
* [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
* TMDB API key
* Google Gemini API key

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/ahmadali3009/movieapp.git](https://github.com/ahmadali3009/movieapp.git)
    cd movieapp
    ```

2.  **Set up environment variables**:
    * Create a `.env` file in the root directory.
    * Add your API keys and MongoDB connection string.
    
    ```
    MONGO_URI=<Your MongoDB Atlas Connection String>
    JWT_SECRET=<Your JWT Secret>
    TMDB_API_KEY=<Your TMDB API Key>
    GEMINI_API_KEY=<Your Gemini API Key>
    ```

3.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```

The application will now be running and accessible through your local host.

---

## 🤝 Contribution

Contributions are highly appreciated! If you have suggestions or find bugs, please feel free to open an issue or submit a pull request.

---

## 📧 Contact

**Ahmed Ali Butt**
* **Email**: `abutt3009@gmail.com`
* **LinkedIn**: https://www.linkedin.com/in/ahmedali3009/
* **Portfolio**: https://ahmedaliporfolio3009.netlify.app

Feel free to connect with me for any questions or collaborations!
