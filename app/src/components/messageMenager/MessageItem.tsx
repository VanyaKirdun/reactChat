import { useSpeechSynthesis } from 'react-speech-kit';
import { SERVER_URL } from '../../config';

export default function MessageItem({item}: {item: any}){
  const { type, textOrPathToFile, text } = item;
  const { speak, voices } = useSpeechSynthesis()
  const lang = document.documentElement.lang || 'ru'
  const voice = voices.find(
    (v: any) => v.lang.includes(lang) && v.name.includes('Google')
  )

  let element: any;
  const pathToFile = `${SERVER_URL}/files${textOrPathToFile}`;

  switch (type) {
    case 'image':
      element = <img className='img-fluid' src={pathToFile} alt='' />
      break
    case 'audio':
      element = <audio className='mw-100' src={pathToFile} controls></audio>
      break
    case 'video':
      element = <video className='mw-100' src={pathToFile} controls></video>
      break
    default:
      element = (
        <>
          <button className='btn' onClick={() => speak({ text: text, voice })}>
            <i className="bi bi-megaphone"></i>
          </button>
          <div className="text-break">{text}</div>
        </>
      )
      break
  }

  return(
    <>
      {element}
    </>
  )
}