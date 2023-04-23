import { existsSync, mkdirSync, rmdirSync } from 'fs'
import multer from 'multer'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import CyrillicToTranslit from 'cyrillic-to-translit-js';
const cyrillicToTranslit = CyrillicToTranslit();

const _dirname = dirname(fileURLToPath(import.meta.url))

export const uploadFile = multer({
  storage: multer.diskStorage({
    destination: async (req: any, _: any, cb: any) => {
      const roomId = req.headers['x-room-id']
      const dirPath = join(_dirname, '../files', roomId)

      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true })
      }

      cb(null, dirPath)
    },
    filename: (_: any, file: any, cb: any) => {
      const fileName = `${Date.now()}-${cyrillicToTranslit.transform(file.originalname, '_').toLowerCase()}`

      cb(null, fileName)
    }
  })
})

export const uploadIconProfile = multer({
  storage: multer.diskStorage({
    destination: async (req: any, _: any, cb: any) => {
      const userId = req.headers['x-user-id']
      const dirPath = join(_dirname, '../icons/profile', userId)

      if(existsSync(dirPath)){
        rmdirSync( dirPath, 
          { recursive:true }, 
        )
      }

      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true })
      }

      cb(null, dirPath)
    },
    filename: (_: any, file: any, cb: any) => {
      const fileName = `${Date.now()}-${cyrillicToTranslit.transform(file.originalname, '_').toLowerCase()}`

      cb(null, fileName)
    }
  })
})

export const uploadIconChat = multer({
  storage: multer.diskStorage({
    destination: async (req: any, _: any, cb: any) => {
      const userId = req.headers['x-room-id']
      const dirPath = join(_dirname, '../icons/chat', userId)

      if(existsSync(dirPath)){
        rmdirSync( dirPath, 
          { recursive:true }, 
        )
      }

      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true })
      }

      cb(null, dirPath)
    },
    filename: (_: any, file: any, cb: any) => {
      const fileName = `${Date.now()}-${cyrillicToTranslit.transform(file.originalname, '_').toLowerCase()}`

      cb(null, fileName)
    }
  })
})