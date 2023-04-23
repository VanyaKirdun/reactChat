import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import { useCallback, useEffect, useState } from 'react'

export default function EmojiMart({ setText, messageInput }: { setText: (param: any) => string, messageInput: HTMLInputElement|null}) {
  const [showEmoji, setShowEmoji] = useState(false);

  const onKeydown = useCallback((e: any) => {
      if (e.key === 'Escape') {
        setShowEmoji(false)
      }
    },
    [setShowEmoji]
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeydown)

    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  }, [onKeydown])

  const onSelect = ({ native }: {native:string}) => {
    setText((text: string) => text + native)
    if(messageInput && messageInput!==null) messageInput.focus()
  }

  return (
    <div >
      <button
        className="p-2 rounded bg-transparent border-0 btn btn-lg" style={{color: 'darkgray'}}
        type='button'
        onClick={() => setShowEmoji(!showEmoji)}
      >
        <i className="bi bi-emoji-smile"></i>
      </button>
      {showEmoji && (
        <Picker 
          style={{position: 'absolute'}}
          data={data}
          onEmojiSelect={onSelect}
          emojiSize={20}
          showPreview={false}
          perLine={6}
        />
      )}
    </div>
  )
}