import { ReactNode } from 'react'
import { COLORS } from '../utils/colors'

export const Subtitle = ({
  text,
  style,
  children,
}: {
  text: string
  style?: any
  children?: ReactNode
}) => (
  <div style={style}>
    <p
      style={{
        fontSize: '1rem',
        fontWeight: 400,
        color: COLORS.GREEN,
        marginBottom: `${children ? '0.5rem' : '1rem'}`,
      }}
    >
      {text.toUpperCase()}
    </p>
    {children}
  </div>
)

export const Subtext = ({ children }: { children?: ReactNode }) => (
  <span style={{ fontSize: '12px', color: COLORS.GRAY }}>{children}</span>
)
