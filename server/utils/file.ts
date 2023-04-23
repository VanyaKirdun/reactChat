import { unlink } from 'fs/promises';
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const _dirname = dirname(fileURLToPath(import.meta.url))

const fileDir = join(_dirname, '../files')
const iconDirProfile = join(_dirname, '../icons/profile')
const iconDirChat = join(_dirname, '../icons/chat')

export const getFilePath = (filePath: any) => join(fileDir, filePath)
export const getIconPathProfile = (iconPathProfile: any) => join(iconDirProfile, iconPathProfile)
export const getIconPathChat = (iconPathChat: any) => join(iconDirChat, iconPathChat)

export const removeFile = async (filePath: any) => {
  try {
    await unlink(join(fileDir, filePath))
  } catch (e) {
    console.log(e)
  }
}

export const removeIconProfile = async (iconPathProfile: any) => {
  try {
    await unlink(join(iconDirProfile, iconPathProfile))
  } catch (e) {
    console.log(e)
  }
}

export const removeIconChat = async (iconPathChat: any) => {
  try {
    await unlink(join(iconDirChat, iconPathChat))
  } catch (e) {
    console.log(e)
  }
}