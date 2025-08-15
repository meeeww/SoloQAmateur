FROM node:20.11.0

WORKDIR /src

# Copiamos dependencias e instalamos
COPY package.json package-lock.json ./
RUN npm install

# Copiamos el resto del código y construimos
COPY . .
RUN npm run build

EXPOSE 3902

CMD ["npm", "run", "start"]
