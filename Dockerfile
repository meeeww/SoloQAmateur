# Utiliza una imagen base de Node.js
FROM node:20.11.0

# Crea un directorio de trabajo
WORKDIR /src

# Copia los archivos de definición de paquete
COPY package.json package-lock.json ./

# Instala las dependencias de Node.js
RUN npm install

# 5. Instala PM2 globalmente
RUN npm install pm2 -g

# Copia el resto del código fuente
COPY . .

# Compila el código de TypeScript
RUN npm run build

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 7566