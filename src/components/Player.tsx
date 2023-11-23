import { useState, type ReactElement, useEffect, type ChangeEvent } from 'react'
import { PauseIcon, PlayIcon } from './Icons'
import { SlideBar } from './SlideBar'

export function Player (): ReactElement {
  const [isPlaying, setIsPlaying] = useState(false)

  const [currentTime, setCurrentTime] = useState(0)
  const [durationTime, setDurationTime] = useState(0)
  const [barProgress, setBarProgress] = useState(0)

  const [currentSong, setCurrentSong] = useState<HTMLAudioElement | null>(null)
  useEffect(() => {
    const song = new Audio('./src/music/epic/a-pirate39s-life.mp3')
    setCurrentSong(song)
  }, [])

  useEffect(() => {
    if (currentSong !== null) {
      currentSong.onloadedmetadata = function () {
        setDurationTime(currentSong.duration)
      }
      currentSong.onended = function () {
        setIsPlaying(false)
      }
    }

    const id = setInterval(() => {
      updateTime()
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [currentSong])

  const handleProgressChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault()
    const newValue = event.target.valueAsNumber

    if (currentSong !== null) {
      const getSecondsFromProgress = (newValue / 100) * currentSong.duration
      currentSong.currentTime = getSecondsFromProgress
      setCurrentTime(getSecondsFromProgress)
    }

    setBarProgress(newValue)
  }

  const formatTime = (seconds: number): string => {
    const getMinutes = Math.floor(seconds / 60).toString()
    const getSeconds = Math.floor(seconds % 60).toString().padStart(2, '0')

    return `${getMinutes}:${getSeconds}`
  }

  const updateTime = (): void => {
    if (currentSong !== null) {
      const songProgressInPercentage = Math.ceil((currentSong.currentTime / currentSong.duration) * 100)
      setBarProgress(songProgressInPercentage)
      setCurrentTime(currentSong.currentTime)
      return
    }
    setCurrentTime(0)
  }

  const handlePause = (): void => {
    currentSong?.pause()
    setIsPlaying(false)
  }

  const handlePlay = (): void => {
    currentSong?.play()
      .then(() => { setIsPlaying(true) })
      .catch((err) => { alert(err) })
  }

  return (
    <div className='absolute bottom-0 bg-black w-full p-3 flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <p className='h-full aspect-square border-2 border-green-500'>Imagen</p>
        <div className=''>
          <h3 className='text-sm font-normal'>Titulo de la cancion</h3>
          <p className='text-xs text-white/60 font-light'>Nombre del artista</p>
        </div>
      </div>

      <div className='flex flex-col justify-center gap-3 w-1/3'>
        <div className='m-auto'>
          {
            isPlaying
              ? (
                <button className='bg-white p-2 rounded-full w-fit' onClick={() => { handlePause() }}>
                  <PauseIcon className='h-5 w-5 text-black' />
                </button>
                )
              : (
                <button className='bg-white p-2 rounded-full w-fit' onClick={() => { handlePlay() }}>
                  <PlayIcon className='h-5 w-5 text-black' />
                </button>
                )
          }
        </div>

        <div className='flex items-center gap-3'>
          <span className='text-xs text-white/70 font-thin'>{formatTime(currentTime)}</span>
          <SlideBar value={barProgress} handleOnChange={handleProgressChange} />
          <span className='text-xs text-white/70 font-thin'>{formatTime(durationTime)}</span>
        </div>
      </div>

      <div className=''>
        <p>Volumen</p>
      </div>
    </div>
  )
}
