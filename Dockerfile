#Sample Dockerfile for NodeJS Apps

FROM node:18


WORKDIR /app

COPY package*.json ./

RUN npm install  
 
COPY . .

EXPOSE 5000


ENV DATABASE_URL=mongodb+srv://minhaz1234:minhaz1234@cluster1.r104mlb.mongodb.net/petcare?retryWrites=true&w=majority&appName=Cluster1
ENV NODE_ENV=production
ENV PORT=5000
ENV CLERK_PUBLISHABLE_KEY=pk_test_cG93ZXJmdWwtbWFja2VyZWwtNTIuY2xlcmsuYWNjb3VudHMuZGV2JA
ENV CLERK_SECRET_KEY=sk_test_BdJpYcgD8DiWRHWDdlyHHAcNh1jYXYBneNKg3Kq1lX
ENV CLOUDINARY_CLOUD_NAME=dd1i5y78f
ENV CLOUDINARY_API_KEY=157336576324219
ENV CLOUDINARY_API_SECRET=QPr4zK0bylKd4y9DaeX9L0Hsun8
ENV CLERK_WEBHOOK_SECRET_KEY=whsec_MYygiftJ/UTrOMbb4qscmHXNzB+lsv1+

CMD [ "node", "dist/server.js" ]