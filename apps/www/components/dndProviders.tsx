"use client"

import * as React from "react"
import {HTML5Backend} from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import {ThemeProviderProps} from "next-themes/dist/types";
import { Theme } from '@radix-ui/themes';

export function CustomDndProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <DndProvider backend={HTML5Backend} {...props}>
      <Theme>
        {children}
      </Theme>
    </DndProvider>
  )
}

