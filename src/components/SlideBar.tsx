import styles from '@/components/SlideBar.module.css'
import { type ChangeEvent, type ReactElement, type CSSProperties } from 'react'

export function SlideBar (
  { value = 0, handleOnChange }:
  { value?: number, handleOnChange: (event: ChangeEvent<HTMLInputElement>) => void }
): ReactElement {
  const style = { '--value': `${value}%` }

  return (
    <>
      <input
        id='slideBar'
        type='range'
        value={value}
        className={styles.slideBar}
        style={style as CSSProperties}
        onChange={handleOnChange}
      />
    </>
  )
}
