FROM node:18-alpine

WORKDIR /app

# 1. Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# 2. Instala SOLO dependencias de producción (más rápido y seguro)
RUN npm install --only=production

COPY . .    

# Expone el puerto que Cloud Run usará
EXPOSE 3006

# Comando para iniciar el microservicio
CMD ["node", "consumo-server.mjs"]
