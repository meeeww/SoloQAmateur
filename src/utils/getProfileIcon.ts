// 

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch-commonjs';

export async function saveProfileIcon(
    iconId: number,
): Promise<string> {
    const iconUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`;

    // Cambiar la ruta a la carpeta `public` en la raíz del proyecto
    const savePath = path.resolve('public', 'profileIcons');
    const fileName = `${iconId.toString().toLowerCase()}.jpg`;

    // Asegúrate de que el directorio de destino exista
    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath, { recursive: true });
    }

    try {
        const response = await fetch(iconUrl);

        if (!response.ok) {
            console.log('No se pudo descargar la imagen del icono.');

            return `assets/profileIcons/0.jpg`;
        }

        // Usar arrayBuffer en lugar de buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Guardar la imagen en el servidor
        const filePath = path.join(savePath, fileName);
        fs.writeFileSync(filePath, buffer);

        // Devolver la URL del backend
        const backendUrl = `assets/profileIcons/${fileName}`;
        return backendUrl;
    } catch (error) {
        console.error(`Error al guardar la imagen del icono: ${error}`);
        throw error;
    }
}