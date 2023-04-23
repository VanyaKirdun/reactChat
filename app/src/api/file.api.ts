import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { SERVER_URL } from '../config';
const cyrillicToTranslit = CyrillicToTranslit();


const uploadFile = async ({ file, chatId }: { file: File, chatId: string | number }) => {
  try {
    const body = new FormData()
    body.append('file', file, cyrillicToTranslit.transform(file.name, '_').toLowerCase())
    const response = await fetch(`${SERVER_URL}/upload/file`, {
      method: 'POST',
      body,
      headers: {
        'x-room-id': `${chatId}`
      }
    })

    if (!response.ok) throw response

    const pathToFile = await response.json()
    return pathToFile
  } catch (e) {
    throw e
  }
}

const uploadIconProfile = async ({ file, userId}: { file: File, userId: string | number}) => {
  try {
    const body = new FormData()
    body.append('file', file, cyrillicToTranslit.transform(file.name, '_').toLowerCase())
    const response = await fetch(`${SERVER_URL}/upload/icon/profile`, {
      method: 'POST',
      body,
      headers: {
        'x-user-id': `${userId}`
      }
    })

    if (!response.ok) throw response

    const pathToFile = await response.json()
    return pathToFile
  } catch (e) {
    throw e
  }
}

const uploadIconChat = async ({ file, userId}: { file: File, userId: string | number}) => {
  try {
    const body = new FormData()
    body.append('file', file, cyrillicToTranslit.transform(file.name, '_').toLowerCase())
    const response = await fetch(`${SERVER_URL}/upload/icon/chat`, {
      method: 'POST',
      body,
      headers: {
        'x-room-id': `${userId}`
      }
    })

    if (!response.ok) throw response

    const pathToFile = await response.json()
    return pathToFile
  } catch (e) {
    throw e
  }
}



const fileApi = { uploadFile, uploadIconProfile, uploadIconChat }

export default fileApi