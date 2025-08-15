FROM node:20.11.0 AS base

WORKDIR /src
    
COPY package.json package-lock.json ./
RUN npm install
    
COPY . .
    
RUN npm run build
    
FROM node:20.11.0 AS worker
    
WORKDIR /src
    
COPY --from=base /src /src
    
EXPOSE 3902
    
CMD ["npm", "run", "start:worker"]
    