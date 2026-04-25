import type * as React from 'react'

type IonIconProps = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
> & {
    name?: string
    src?: string
    icon?: string
    size?: 'small' | 'large'
    ios?: string
    md?: string
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'ion-icon': IonIconProps
        }
    }
}

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'ion-icon': IonIconProps
        }
    }
}

export {}
