# Ecommerce Admin Panel

![Ecommerce Admin Panel](/public/assets/screenshots/dashboard.png)

This project is an admin panel for managing an eCommerce store. It allows you to:

- Add, edit, or remove products from the main eCommerce store.
- Manage access to the admin panel by assigning roles to other users.
- Track orders and manage order statuses.
- Leverage Google Authentication for secure login.

This project was built using modern web technologies to ensure scalability, security, and ease of use.

---

## Technologies Used

- **Framework**: ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) [Next.js](https://nextjs.org/)
- **Styling**: ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) [Tailwind CSS](https://tailwindcss.com/)
- **Database**: ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) [MongoDB](https://www.mongodb.com/)
- **Storage**: ![AWS S3](https://img.shields.io/badge/AWS%20S3-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) [AWS S3](https://aws.amazon.com/s3/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Google Provider
- **Other Tools**:
  - ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) [Axios](https://axios-http.com/) for API calls
  - ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) [Mongoose](https://mongoosejs.com/) for MongoDB ORM
  - ![React SweetAlert2](https://img.shields.io/badge/React%20SweetAlert2-FB6340?style=for-the-badge&logo=react&logoColor=white) [React SweetAlert2](https://github.com/djorg83/react-sweetalert2) for elegant alerts
  - ![React SortableJS](https://img.shields.io/badge/React%20SortableJS-F09E4A?style=for-the-badge&logo=react&logoColor=white) [React SortableJS](https://github.com/SortableJS/react-sortablejs) for drag-and-drop functionality

---

## Prerequisites

To run this project locally, make sure you have the following environment variables set:

```env
GOOGLE_ID=<your-google-client-id>
GOOGLE_SECRET=<your-google-client-secret>
NEXTAUTH_URL=<your-nextauth-url>
NEXTAUTH_SECRET=<your-nextauth-secret>
MONGODB_URI=<your-mongodb-connection-string>
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
AWS_S3_BUCKET_NAME=<your-s3-bucket-name>
AWS_REGION=<your-aws-region>
```

You will need to obtain these keys from their respective providers:
- **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com/)
- **MongoDB**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **AWS**: [AWS Management Console](https://aws.amazon.com/console/)

---

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/SidakMarwah/Ecommerce-Admin.git
   ```

2. Navigate to the project directory:

   ```bash
   cd ecommerce-admin
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root of the project and add the environment variables listed above. You can obtain the required keys from the respective services (MongoDB, AWS, Google, etc.) as mentioned earlier.

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the admin panel in action.

---

## Hosted Admin Panel

To access the hosted version of this admin panel, contact the owner of this repository, **Sidak Marwah**, at [sidakmarwah@gmail.com](mailto:sidakmarwah@gmail.com) to request admin access.

---

## Features

- **Dashboard**: A comprehensive overview of key metrics and system status.
- **Product Management**: Add, edit, delete products seamlessly.
- **Category Management**: Organize products into categories for better organization.
- **Order Tracking**: Track orders and manage their statuses.
- **Settings**: Configure system preferences and user roles.
- **User Management**: Manage access to the admin panel for other users.
- **Secure Login**: Authenticate using Google OAuth with NextAuth.js.
- **Cloud Integration**: Utilize AWS S3 for image and asset storage.

---

## Author

This project was developed by **Sidak Marwah**.

- Email: [sidakmarwah@gmail.com](mailto:sidakmarwah@gmail.com)
- GitHub: [SidakMarwah](https://github.com/SidakMarwah)
- LinkedIn: [Sidak Marwah](https://www.linkedin.com/in/sidakmarwah/)
- Instagram: [sidakmarwah](https://www.instagram.com/sidakmarwah/)
- X (formerly Twitter): [@SidakMarwah](https://x.com/SidakMarwah)

[![GitHub](https://img.shields.io/badge/GitHub-Visit_Profile-black?style=for-the-badge&logo=github)](https://github.com/SidakMarwah)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sidakmarwah/)
[![Instagram](https://img.shields.io/badge/Instagram-Follow-orange?style=for-the-badge&logo=instagram)](https://www.instagram.com/sidakmarwah/)
[![X](https://img.shields.io/badge/X-Follow-blue?style=for-the-badge&logo=x)](https://x.com/SidakMarwah)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contribution

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

---

Happy coding! 🎉

---
